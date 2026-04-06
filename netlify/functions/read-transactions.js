const { getSheets, SHEET_ID, CORS_HEADERS, respond } = require('./sheets-helper');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  try {
    const sheets = getSheets();

    // Get all sheet tabs
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const allSheets = spreadsheet.data.sheets.map(s => s.properties.title);

    // Filter to monthly account tabs (skip MASTER and Template)
    const monthlyTabs = allSheets.filter(name =>
      name !== 'MASTER' && name !== 'Template Sheet' && name !== 'Settlements' &&
      (name.includes('Account') || name.includes('account'))
    );

    const MONTHS = { jan:1,january:1,feb:2,february:2,mar:3,march:3,apr:4,april:4,may:5,june:6,jun:6,jul:7,july:7,aug:8,august:8,sep:9,september:9,oct:10,october:10,nov:11,november:11,dec:12,december:12 };

    function parseSheetPeriod(name) {
      const clean = name.replace(/\s*Accounts?\s*/gi, '').trim();
      const m = clean.match(/(\w+)\s*[']?\s*(\d{2,4})/i);
      if (m) {
        const month = MONTHS[m[1].toLowerCase()];
        let year = parseInt(m[2]);
        if (year < 100) year += 2000;
        if (month) return `${year}-${String(month).padStart(2, '0')}`;
      }
      return null;
    }

    // Batch read all tabs (transactions cols A-F, summary cols H-I)
    const ranges = monthlyTabs.flatMap(tab => [
      `'${tab}'!A1:F100`,
      `'${tab}'!H1:J20`,
    ]);

    const batchResult = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SHEET_ID,
      ranges,
    });

    const allTransactions = [];
    const monthlyMeta = [];
    let txId = 1;

    for (let i = 0; i < monthlyTabs.length; i++) {
      const tabName = monthlyTabs[i];
      const period = parseSheetPeriod(tabName);
      if (!period) continue;

      const [year, month] = period.split('-').map(Number);
      const txData = batchResult.data.valueRanges[i * 2]?.values || [];
      const metaData = batchResult.data.valueRanges[i * 2 + 1]?.values || [];

      // Parse meta (balance info)
      let bfGlc = null, bfKt = null, balanceOwed = null, totalShared = null;
      for (const row of metaData) {
        const label = (row[0] || '').toString().trim();
        const val = parseFloat((row[1] || '').toString().replace(/[$,]/g, ''));
        if (label === 'GLC') bfGlc = val;
        else if (label === 'KT') bfKt = val;
        else if (label.includes('Balance Owed')) balanceOwed = val;
        else if (label.includes('Total Shared')) totalShared = val;
      }

      monthlyMeta.push({ period, sheet: tabName, bf_glc: bfGlc, bf_kt: bfKt, balance_owed: balanceOwed, total_shared: totalShared });

      // Parse transactions (skip header row)
      for (let r = 1; r < txData.length; r++) {
        const row = txData[r];
        const item = (row[1] || '').toString().trim();
        const priceRaw = (row[2] || '').toString().replace(/[$,]/g, '');
        const price = parseFloat(priceRaw);
        const paidBy = (row[3] || '').toString().trim().toUpperCase();

        if (!item || isNaN(price) || price <= 0 || !['KT', 'GLC'].includes(paidBy)) continue;

        let dateStr = (row[0] || '').toString().trim();
        let txDate = null;

        // Try to parse date
        if (dateStr) {
          // Handle serial numbers from Sheets
          const serial = parseFloat(dateStr);
          if (!isNaN(serial) && serial > 40000) {
            const d = new Date((serial - 25569) * 86400 * 1000);
            txDate = d.toISOString().split('T')[0];
          } else {
            // Try common date formats
            const d = new Date(dateStr);
            if (!isNaN(d.getTime()) && d.getFullYear() > 2020) {
              txDate = d.toISOString().split('T')[0];
            }
          }
        }

        if (!txDate) txDate = `${year}-${String(month).padStart(2, '0')}-01`;

        const type = (row[4] || '').toString().trim() || 'Uncategorized';
        const remarks = (row[5] || '').toString().trim();

        allTransactions.push({
          id: txId++,
          date: txDate,
          item,
          price: Math.round(price * 100) / 100,
          paidBy,
          type: type === 'Uncategorized' && period === '2024-06' ? 'Household goods' : type,
          remarks,
          period,
          sheet: tabName,
          row: r + 1, // 1-indexed row in sheet for editing
        });
      }
    }

    // Read settlements tab if it exists
    let settlements = [];
    if (allSheets.includes('Settlements')) {
      try {
        const settleData = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: "'Settlements'!A1:F100",
        });
        const rows = settleData.data.values || [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          settlements.push({
            period: row[0],
            kt_status: row[1] || 'open',
            glc_status: row[2] || 'open',
            settled_date: row[3] || null,
            final_balance: parseFloat(row[4]) || null,
            remarks: row[5] || '',
          });
        }
      } catch (e) {
        // Settlements tab doesn't exist yet — that's fine
      }
    }

    return respond(200, {
      transactions: allTransactions,
      monthly_meta: monthlyMeta,
      settlements,
      tabs: monthlyTabs,
      total: allTransactions.length,
    });

  } catch (error) {
    console.error('Error:', error);
    return respond(500, { error: error.message });
  }
};

const { getSheets, SHEET_ID, CORS_HEADERS, respond } = require('./sheets-helper');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return respond(405, { error: 'POST only' });

  try {
    const { date, item, price, paidBy, type, remarks, period } = JSON.parse(event.body);

    if (!date || !item || !price || !paidBy) {
      return respond(400, { error: 'Missing required fields: date, item, price, paidBy' });
    }

    const sheets = getSheets();

    // Find or create the right monthly tab
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const allSheets = spreadsheet.data.sheets.map(s => s.properties.title);

    // Determine target sheet from period (YYYY-MM)
    const [year, month] = (period || date.slice(0, 7)).split('-').map(Number);
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const shortYear = String(year).slice(2);

    // Try to find existing tab with various naming patterns
    const possibleNames = [
      `${monthNames[month]}${shortYear} Accounts`,
      `${monthNames[month]} ${shortYear} Accounts`,
      `${['','January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${shortYear} Accounts`,
    ];

    let targetSheet = null;
    for (const name of possibleNames) {
      if (allSheets.includes(name)) { targetSheet = name; break; }
    }

    // Also check all sheets for period match
    if (!targetSheet) {
      for (const name of allSheets) {
        if (name.toLowerCase().includes(monthNames[month].toLowerCase()) &&
            name.includes(shortYear)) {
          targetSheet = name;
          break;
        }
      }
    }

    if (!targetSheet) {
      return respond(404, { error: `No sheet found for period ${year}-${String(month).padStart(2, '0')}. Create the monthly tab first.` });
    }

    // Find the next empty row in columns A-F
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${targetSheet}'!A:F`,
    });

    const rows = existing.data.values || [];
    let insertRow = rows.length + 1;

    // Find last row with data in columns A-D
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i] && (rows[i][1] || rows[i][2] || rows[i][3])) {
        insertRow = i + 2; // next row after last data row
        break;
      }
    }

    // Format the date for sheets
    const formattedDate = date;

    // Append the row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${targetSheet}'!A${insertRow}:F${insertRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[formattedDate, item, price, paidBy, type || '', remarks || '']],
      },
    });

    return respond(200, {
      success: true,
      sheet: targetSheet,
      row: insertRow,
      message: `Added "${item}" to ${targetSheet}`,
    });

  } catch (error) {
    console.error('Error:', error);
    return respond(500, { error: error.message });
  }
};

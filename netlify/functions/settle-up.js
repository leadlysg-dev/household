const { getSheets, SHEET_ID, CORS_HEADERS, respond } = require('./sheets-helper');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return respond(405, { error: 'POST only' });

  try {
    const { period, person, action } = JSON.parse(event.body);
    // person: "KT" or "GLC"
    // action: "done" (mark as submitted), "reopen", "settle"

    if (!period || !person || !action) {
      return respond(400, { error: 'Missing period, person, or action' });
    }

    const sheets = getSheets();

    // Ensure Settlements tab exists
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const allSheets = spreadsheet.data.sheets.map(s => s.properties.title);

    if (!allSheets.includes('Settlements')) {
      // Create the tab
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: { properties: { title: 'Settlements' } }
          }]
        }
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: "'Settlements'!A1:F1",
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Period', 'KT_Status', 'GLC_Status', 'Settled_Date', 'Final_Balance', 'Remarks']],
        },
      });
    }

    // Read current settlements
    const settleData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Settlements'!A1:F100",
    });

    const rows = settleData.data.values || [];
    let targetRow = null;
    let currentKt = 'open';
    let currentGlc = 'open';

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === period) {
        targetRow = i + 1;
        currentKt = rows[i][1] || 'open';
        currentGlc = rows[i][2] || 'open';
        break;
      }
    }

    // Update status
    let newKt = currentKt;
    let newGlc = currentGlc;
    let settledDate = '';
    let finalBalance = '';

    if (action === 'done') {
      if (person === 'KT') newKt = 'done';
      else newGlc = 'done';
    } else if (action === 'reopen') {
      if (person === 'KT') newKt = 'open';
      else newGlc = 'open';
      settledDate = '';
    } else if (action === 'settle') {
      newKt = 'settled';
      newGlc = 'settled';
      settledDate = new Date().toISOString().split('T')[0];
    }

    if (targetRow) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'Settlements'!A${targetRow}:F${targetRow}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[period, newKt, newGlc, settledDate, finalBalance, '']],
        },
      });
    } else {
      // Append new row
      const newRow = rows.length + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'Settlements'!A${newRow}:F${newRow}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[period, newKt, newGlc, settledDate, finalBalance, '']],
        },
      });
    }

    return respond(200, {
      success: true,
      period,
      kt_status: newKt,
      glc_status: newGlc,
      settled_date: settledDate,
    });

  } catch (error) {
    console.error('Error:', error);
    return respond(500, { error: error.message });
  }
};

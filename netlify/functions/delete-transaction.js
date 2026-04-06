const { getSheets, SHEET_ID, CORS_HEADERS, respond } = require('./sheets-helper');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return respond(405, { error: 'POST only' });

  try {
    const { sheet, row } = JSON.parse(event.body);

    if (!sheet || !row) return respond(400, { error: 'Missing sheet and row' });

    const sheets = getSheets();

    // Clear the row content (don't delete the row to avoid shifting formulas)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${sheet}'!A${row}:F${row}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['', '', '', '', '', '']],
      },
    });

    return respond(200, { success: true, message: `Cleared row ${row} in ${sheet}` });

  } catch (error) {
    console.error('Error:', error);
    return respond(500, { error: error.message });
  }
};

const { google } = require('googleapis');

function getAuth() {
  const rawKey = process.env.GOOGLE_SA_PRIVATE_KEY;
  if (!rawKey) throw new Error('GOOGLE_SA_PRIVATE_KEY not set');

  // Support both raw base64 (just the key body) and full JSON
  let privateKey;
  let clientEmail;

  try {
    // Try parsing as full JSON first
    const parsed = JSON.parse(rawKey);
    privateKey = parsed.private_key;
    clientEmail = parsed.client_email;
  } catch {
    // It's base64-encoded key body — decode it
    const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
    try {
      const parsed = JSON.parse(decoded);
      privateKey = parsed.private_key;
      clientEmail = parsed.client_email;
    } catch {
      // Raw PEM key — use env var for email
      privateKey = decoded.includes('BEGIN') ? decoded : `-----BEGIN PRIVATE KEY-----\n${decoded}\n-----END PRIVATE KEY-----\n`;
      clientEmail = process.env.GOOGLE_SA_EMAIL || 'household-ledger@household-492515.iam.gserviceaccount.com';
    }
  }

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  return auth;
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1UvAx2NQd_BufjrCjvAol7PoukgTVctPX9jdepJfLtzU';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

module.exports = { getSheets, SHEET_ID, CORS_HEADERS, respond };

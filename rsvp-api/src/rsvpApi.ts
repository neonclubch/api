import { google } from "googleapis";

// Use default service account credentials for Cloud Functions
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env["SPREADSHEET_ID"];

if (!spreadsheetId) {
  throw new Error("SPREADSHEET_ID environment variable is not set");
}

export async function getRsvp(id: string) {
  try {
    console.log("Attempting to access spreadsheet:", spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:F",
    });

    const rows = response.data.values;
    if (!rows) {
      throw new Error("No data found in spreadsheet");
    }

    // Find the row with matching ID
    const row = rows.find((row) => row[0] === id);

    if (!row) {
      return undefined;
    }

    // Map row data to object using headers
    return {
      id: row[0] as string,
      firstName: row[1] as string,
      lastName: row[2] as string,
      lang: row[3] as "de" | "en" | "it",
      inviteSent: row[4] as string | undefined,
    };
  } catch (error: any) {
    console.error("Google Sheets API Error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      spreadsheetId
    });
    
    if (error.code === 403) {
      throw new Error(`Permission denied. Please ensure:
        1. Google Sheets API is enabled in your Google Cloud project
        2. The spreadsheet is shared with the Cloud Function's service account
        3. The service account has at least 'Viewer' access to the spreadsheet`);
    }
    
    throw error;
  }
}

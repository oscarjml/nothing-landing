# Google Sheets SSL Error Fix

## Problem
You're experiencing this error:
```
Error: error:1E08010C:DECODER routines::unsupported
```

This is a common SSL/TLS issue with Google APIs in Node.js environments.

## Solution Steps

### 1. Check Your Private Key Format
Your private key in `.env.local` should look exactly like this:
```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- Keep the quotes around the entire key
- Use `\n` for line breaks (not actual line breaks)
- Include the full key from BEGIN to END

### 2. Extract Credentials from Your JSON File
I see you have `gen-lang-client-0825234901-f05c92a25e22.json` in your Downloads folder.

Open that file and extract:
- `private_key` → Copy the entire value (including quotes)
- `client_email` → Copy the email address

### 3. Update Your .env.local
Replace the placeholder values with your actual credentials:

```bash
# From your JSON file
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id
```

### 4. Create and Share Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
4. Share the sheet with your service account email (from step 2)
5. Give "Editor" permissions

### 5. Test the Integration
1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Try making a test order
3. Check the console for any remaining errors

### 6. Alternative: Use the Separate API Endpoint
If you're still having issues, the system will automatically try the alternative endpoint at `/api/sheets/save-order` which has better error handling.

## Troubleshooting

### Common Issues:

1. **Private Key Format**: Make sure there are no extra spaces or characters
2. **Permissions**: Ensure the service account has access to your sheet
3. **Spreadsheet ID**: Double-check you copied the correct ID from the URL
4. **Environment Variables**: Restart the server after changing `.env.local`

### Test Your Configuration:
You can test the Google Sheets integration separately by making a POST request to:
```
http://localhost:3000/api/sheets/save-order
```

With this test data:
```json
{
  "orderID": "TEST123",
  "customerInfo": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "address": "123 Test St",
    "city": "Test City",
    "state": "CA",
    "zipCode": "12345"
  },
  "customMessage": "Test message",
  "quantity": 1,
  "total": "12.99"
}
```

## Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure the Google Sheet is shared with your service account
4. Try creating a new service account if the current one doesn't work

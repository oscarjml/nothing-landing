# Nothing E-commerce Setup Guide

This guide will help you configure PayPal and Google Sheets integration for your Nothing Premium Card store.

## 🔧 Environment Variables Setup

Copy the `.env.local` file and replace the placeholder values with your actual credentials.

## 💳 PayPal Configuration

### 1. Create PayPal Developer Account
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal Business account
3. Navigate to "My Apps & Credentials"

### 2. Create Sandbox Application (for testing)
1. Click "Create App"
2. Choose "Sandbox" environment
3. Select your business account
4. Copy the **Client ID** and **Client Secret**
5. Update `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
   PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
   PAYPAL_ENVIRONMENT=sandbox
   ```

### 3. Create Live Application (for production)
1. Click "Create App"
2. Choose "Live" environment
3. Select your business account
4. Copy the **Client ID** and **Client Secret**
5. For production, update `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   PAYPAL_ENVIRONMENT=live
   ```

## 📊 Google Sheets Configuration

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### 3. Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file

### 4. Extract Credentials from JSON
From the downloaded JSON file, copy:
- `private_key` (replace `\n` with actual line breaks)
- `client_email`

Update `.env.local`:
```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```

### 5. Create Google Sheet
1. Create a new Google Sheet
2. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Share the sheet with your service account email (from step 4)
4. Give "Editor" permissions
5. Update `.env.local`:
   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   ```

## 🚀 Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test PayPal Sandbox
- Use PayPal sandbox test accounts
- Test credit card payments
- Verify orders appear in Google Sheets

### 3. PayPal Test Cards
For sandbox testing, use these test cards:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

## 🌐 Production Deployment

### 1. Update Environment Variables
For production deployment (Vercel):
1. Go to your Vercel project settings
2. Add all environment variables from `.env.local`
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. Change `PAYPAL_ENVIRONMENT` to `live`
5. Use your live PayPal credentials

### 2. Verify Google Sheets Access
Ensure your service account has access to the production Google Sheet.

## 📋 Order Data Structure

Orders are saved to Google Sheets with these columns:
- Order ID
- Date
- First Name
- Last Name
- Email
- Address
- City
- State
- ZIP Code
- Message
- Quantity
- Subtotal
- Shipping
- Total

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Keep your PayPal Client Secret secure
- Regularly rotate your Google Service Account keys
- Use HTTPS in production
- Validate all user inputs

## 🆘 Troubleshooting

### PayPal Issues
- Verify Client ID and Secret are correct
- Check PayPal environment (sandbox vs live)
- Ensure your PayPal account is verified

### Google Sheets Issues
- Verify service account has access to the sheet
- Check private key format (proper line breaks)
- Ensure Google Sheets API is enabled

### Common Errors
- **401 Unauthorized**: Check PayPal credentials
- **403 Forbidden**: Verify Google Sheets permissions
- **Network errors**: Check environment variables

## 📞 Support

For technical issues:
- Check browser console for errors
- Verify all environment variables are set
- Test with PayPal sandbox first
- Contact support@sendnothing.co for help

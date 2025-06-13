import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Configure Google Sheets API with better error handling
    let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!privateKey || !clientEmail || !spreadsheetId) {
      console.error('Missing Google Sheets configuration');
      return NextResponse.json(
        { error: 'Missing Google Sheets configuration' },
        { status: 500 }
      );
    }

    // Clean and format the private key
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    // Validate private key format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || 
        !privateKey.includes('-----END PRIVATE KEY-----')) {
      console.error('Invalid private key format');
      return NextResponse.json(
        { error: 'Invalid private key format' },
        { status: 500 }
      );
    }

    // Create auth with explicit configuration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        private_key: privateKey,
        client_email: clientEmail,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare data for Google Sheets
    const currentDate = new Date().toISOString().split('T')[0];
    
    const rowData = [
      orderData.orderID,
      currentDate,
      orderData.customerInfo.firstName,
      orderData.customerInfo.lastName,
      orderData.customerInfo.email,
      orderData.customerInfo.address,
      orderData.customerInfo.city,
      orderData.customerInfo.state,
      orderData.customerInfo.zipCode,
      orderData.customMessage,
      orderData.quantity,
      (parseFloat(orderData.total) - 3.00).toFixed(2), // Subtotal
      '3.00', // Shipping
      orderData.total
    ];

    // First, try to get the sheet to check if headers exist
    let hasHeaders = false;
    try {
      const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:N1',
      });
      
      hasHeaders = !!(getResponse.data.values && getResponse.data.values.length > 0);
    } catch (error) {
      console.log('Sheet might be empty, will add headers');
    }

    // Add headers if they don't exist
    if (!hasHeaders) {
      const headers = [
        'Order ID',
        'Date',
        'First Name',
        'Last Name',
        'Email',
        'Address',
        'City',
        'State',
        'ZIP Code',
        'Message',
        'Quantity',
        'Subtotal',
        'Shipping',
        'Total'
      ];

      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:N1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      } catch (error) {
        console.error('Error adding headers:', error);
      }
    }

    // Append the new order data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:N',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to save to Google Sheets', details: errorMessage },
      { status: 500 }
    );
  }
}

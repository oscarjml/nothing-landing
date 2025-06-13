import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function saveToGoogleSheets(orderData: {
  orderID: string;
  quantity: number;
  customMessage: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  total: string;
}) {
  try {
    // Configure Google Sheets API
    let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!privateKey || !clientEmail || !spreadsheetId) {
      console.error('Missing Google Sheets configuration');
      return false;
    }

    // Fix private key formatting
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Ensure proper key format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      console.error('Invalid private key format');
      return false;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        private_key: privateKey,
        client_email: clientEmail,
        project_id: 'your-project-id', // Add this if needed
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare data for Google Sheets
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
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

    // Check if sheet exists and has headers
    try {
      const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:N1',
      });

      // If no headers exist, add them
      if (!getResponse.data.values || getResponse.data.values.length === 0) {
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

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:N1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }
    } catch (error) {
      console.error('Error checking/creating headers:', error);
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

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderID, quantity, customMessage, customerInfo, total } = await request.json();

    // Validate required fields
    if (!orderID || !quantity || !customMessage || !customerInfo || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await response.json();

    if (!response.ok) {
      console.error('PayPal capture failed:', captureData);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment', details: captureData },
        { status: 500 }
      );
    }

    // Check if payment was successful
    if (captureData.status === 'COMPLETED') {
      // Save order to Google Sheets
      const orderData = {
        orderID,
        quantity,
        customMessage,
        customerInfo,
        total,
      };

      // Try to save to Google Sheets using the main function
      let sheetsSaved = await saveToGoogleSheets(orderData);
      
      // If the main function fails, try the alternative API endpoint
      if (!sheetsSaved) {
        try {
          const sheetsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sheets/save-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
          
          if (sheetsResponse.ok) {
            sheetsSaved = true;
            console.log('Successfully saved to Google Sheets using alternative method');
          }
        } catch (error) {
          console.error('Alternative Google Sheets save also failed:', error);
        }
      }
      
      if (!sheetsSaved) {
        console.error('Failed to save to Google Sheets, but payment was successful');
        // Note: Payment was successful, but we couldn't save to sheets
        // You might want to implement a retry mechanism or manual backup
      }

      return NextResponse.json({
        success: true,
        orderID,
        captureID: captureData.id,
        status: captureData.status,
        sheetsSaved,
      });
    } else {
      return NextResponse.json(
        { error: 'Payment not completed', status: captureData.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

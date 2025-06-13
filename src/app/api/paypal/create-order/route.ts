import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { quantity, customMessage, customerInfo, total } = await request.json();

    // Validate required fields
    if (!quantity || !customMessage || !customerInfo || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (parseFloat(total) - 3.00).toFixed(2), // Subtract shipping
              },
              shipping: {
                currency_code: 'USD',
                value: '3.00',
              },
            },
          },
          items: [
            {
              name: 'Nothing Premium Card and Envelope',
              description: `Custom message: "${customMessage.substring(0, 50)}${customMessage.length > 50 ? '...' : ''}"`,
              unit_amount: {
                currency_code: 'USD',
                value: (9.99).toFixed(2),
              },
              quantity: quantity.toString(),
            },
          ],
          shipping: {
            name: {
              full_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            },
            address: {
              address_line_1: customerInfo.address,
              admin_area_2: customerInfo.city,
              admin_area_1: customerInfo.state,
              postal_code: customerInfo.zipCode,
              country_code: 'US',
            },
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        brand_name: 'Nothing Store',
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('PayPal order creation failed:', order);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: order },
        { status: 500 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

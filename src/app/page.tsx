'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const predefinedMessages = [
  "Out of all the things I could've given you… I chose Nothing.",
  "Nothing says 'I care' quite like… Nothing.",
  "Not everyone gets Nothing. Only those who mean something.",
  "In a world full of noise, I chose to give you Nothing.",
  "What do you give someone who has it all? Nothing."
];

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function Home() {
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const productPrice = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '9.99');
  const shippingPrice = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_PRICE || '3.00');
  const subtotal = productPrice * quantity;
  const total = subtotal + shippingPrice;

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
    setCustomMessage(message);
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      customerInfo.address &&
      customerInfo.city &&
      customerInfo.state &&
      customerInfo.zipCode &&
      customMessage.trim()
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F1EB' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider mb-4"
            style={{ 
              fontFamily: '"Times New Roman", Times, serif',
              color: '#1E2A45',
              lineHeight: '1',
              letterSpacing: '0.02em',
            }}
          >
            Nothing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium Card and Envelope - The perfect gift for someone who has everything
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: '#1E2A45' }}>
                Nothing Premium Card and Envelope
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Price per card:</span>
                  <span className="text-xl font-semibold">${productPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Shipping (USA only):</span>
                  <span className="text-xl font-semibold">${shippingPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-lg font-medium mb-3" style={{ color: '#1E2A45' }}>
                Quantity (1-10 cards)
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} card{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-lg font-medium mb-3" style={{ color: '#1E2A45' }}>
                Custom Message (max 250 characters)
              </label>
              
              {/* Predefined Messages */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Choose a suggested message:</p>
                <div className="space-y-2">
                  {predefinedMessages.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageSelect(message)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedMessage === message
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">{message}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message Input */}
              <textarea
                value={customMessage}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setCustomMessage(e.target.value);
                    setSelectedMessage('');
                  }
                }}
                placeholder="Or write your own message..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {customMessage.length}/250 characters
              </div>
            </div>
          </div>

          {/* Customer Info & Checkout */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1E2A45' }}>
                Shipping Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={customerInfo.state}
                    onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">State</option>
                    {usStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleCustomerInfoChange('zipCode', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1E2A45' }}>
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{quantity} × Nothing Premium Card</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* PayPal Checkout */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {isFormValid() ? (
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                    currency: 'USD',
                    intent: 'capture'
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal'
                    }}
                    createOrder={async () => {
                      const response = await fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          quantity,
                          customMessage,
                          customerInfo,
                          total: total.toFixed(2)
                        }),
                      });
                      const order = await response.json();
                      return order.id;
                    }}
                    onApprove={async (data) => {
                      const response = await fetch('/api/paypal/capture-payment', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          orderID: data.orderID,
                          quantity,
                          customMessage,
                          customerInfo,
                          total: total.toFixed(2)
                        }),
                      });
                      const result = await response.json();
                      if (result.success) {
                        alert('Payment successful! Your order has been placed.');
                        // Reset form
                        setQuantity(1);
                        setCustomMessage('');
                        setSelectedMessage('');
                        setCustomerInfo({
                          firstName: '',
                          lastName: '',
                          email: '',
                          address: '',
                          city: '',
                          state: '',
                          zipCode: ''
                        });
                      } else {
                        alert('Payment failed. Please try again.');
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      alert('An error occurred. Please try again.');
                    }}
                  />
                </PayPalScriptProvider>
              ) : (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">
                    Please fill in all required information to proceed with payment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Shipping available to USA only • Questions? Contact us at support@sendnothing.co
          </p>
          <div className="mt-4">
            <a 
              href="/nothing" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Visit our space-themed experience
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

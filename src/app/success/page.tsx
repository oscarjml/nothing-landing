'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{ token: string; payerID: string } | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const payerID = searchParams.get('PayerID');
    
    if (token && payerID) {
      setOrderDetails({ token, payerID });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F1EB' }}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 
            className="text-3xl font-normal mb-2"
            style={{ 
              fontFamily: '"Times New Roman", Times, serif',
              color: '#1E2A45',
            }}
          >
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. Your Nothing Premium Card will be processed and shipped soon.
          </p>
        </div>

        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Order Token: <span className="font-mono text-xs">{orderDetails.token}</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You will receive a confirmation email shortly with your order details and tracking information.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Store
            </Link>
            <Link 
              href="/nothing"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Visit our space experience
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions? Contact us at support@sendnothing.co
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F1EB' }}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

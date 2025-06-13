'use client';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F1EB' }}>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 
            className="text-3xl font-normal mb-2"
            style={{ 
              fontFamily: '"Times New Roman", Times, serif',
              color: '#1E2A45',
            }}
          >
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            If you experienced any issues during checkout, please try again or contact our support team.
          </p>
          
          <div className="flex flex-col space-y-2">
            <a 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Store
            </a>
            <a 
              href="/nothing"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Visit our space experience
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact us at support@sendnothing.co
          </p>
        </div>
      </div>
    </div>
  );
}

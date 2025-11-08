import { Link } from 'react-router-dom'
import Header from './Header'

interface ConfirmationScreenProps {
  craneName: string
  customerName: string
  email: string
  phone: string
  company?: string
  onStartOver: () => void
}

function ConfirmationScreen({ 
  craneName, 
  customerName, 
  email, 
  phone, 
  company, 
  onStartOver 
}: ConfirmationScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl text-green-600">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Quote Request Submitted!</h1>
          <p className="text-gray-500 mb-6">
            Thank you for your request. We'll contact you within 24 hours with a detailed quote.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="font-bold mb-3">Request Details:</h3>
            <p className="mb-2"><strong>Crane:</strong> {craneName}</p>
            <p className="mb-2"><strong>Name:</strong> {customerName}</p>
            <p className="mb-2"><strong>Email:</strong> {email}</p>
            <p className="mb-2"><strong>Phone:</strong> {phone}</p>
            {company && (
              <p className="mb-2"><strong>Company:</strong> {company}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onStartOver} 
              className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer text-white hover:opacity-90"
              style={{ backgroundColor: '#6B1B1F' }}
            >
              Request Another Quote
            </button>
            <Link to="/" className="flex-1">
              <button className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationScreen
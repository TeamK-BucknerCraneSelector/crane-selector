import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BucknerLogo from '../../assets/buckner.svg'
import QuoteForm from '../../components/QuoteForm/QuoteForm'

interface CraneData {
  crane: string
  name: string
  email: string
  phone: string
  company?: string
  projectDetails?: string
}

function RequestFlow() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'quote' | 'confirmation'>('landing')
  const [cranes, setCranes] = useState<string[]>([])
  const [selectedCrane, setSelectedCrane] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [submittedData, setSubmittedData] = useState<CraneData | null>(null)

  useEffect(() => {
    fetchAvailableCranes()
  }, [])

  const fetchAvailableCranes = async () => {
    setLoading(true)
    try {
      setCranes([
        "LTR 1100", "LTR 1150", "LTR 1220", "LR 1300", "LR 1400", "LR 1500",
        "LR 1600", "LG 1750", "LR 1800", "LR 11000", "LR 11350", "LR 13000",
      ])
    } catch (error) {
      console.error('Error fetching cranes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuoteRequest = () => {
    if (selectedCrane) {
      setCurrentStep('quote')
    }
  }

  const handleQuoteSubmit = (formData: any) => {
    setSubmittedData({ ...formData, crane: selectedCrane })
    setCurrentStep('confirmation')
  }

  const handleStartOver = () => {
    setCurrentStep('landing')
    setSelectedCrane('')
    setSubmittedData(null)
  }

  const renderConfirmation = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
        <Link className="my-auto px-2" to="/">
          <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
        </Link>
      </header>
      
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
            <p className="mb-2"><strong>Crane:</strong> {submittedData?.crane}</p>
            <p className="mb-2"><strong>Name:</strong> {submittedData?.name}</p>
            <p className="mb-2"><strong>Email:</strong> {submittedData?.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {submittedData?.phone}</p>
            {submittedData?.company && (
              <p className="mb-2"><strong>Company:</strong> {submittedData.company}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleStartOver} 
              className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-red-700 text-white hover:bg-red-800"
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

  const renderLanding = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
        <Link className="my-auto px-2" to="/">
          <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
        </Link>
      </header>
      
      <section className="relative h-96 bg-crane-hero bg-cover bg-center flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">FIND YOUR SOLUTION</h1>
          <p className="text-xl mb-8">Professional crane rental solutions for your project needs</p>
        </div>
      </section>

      <div className="flex flex-col items-center flex-grow p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Request Crane</h1>
            <p className="text-gray-500">Select a crane and request a quote instantly</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Select Your Crane *</label>
              <select
                value={selectedCrane}
                onChange={(e) => setSelectedCrane(e.target.value)}
                disabled={loading}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-700 disabled:opacity-50"
              >
                <option value="">Choose a crane model...</option>
                {cranes.map((crane) => (
                  <option key={crane} value={crane}>{crane}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleQuoteRequest}
              disabled={!selectedCrane}
              className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request a Quote
            </button>

            <Link to="/wizard-flow">
              <button className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800">
                Need Help Choosing? Use Crane Finder
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-1">Fast Response</h4>
              <p className="text-sm text-gray-500">Quote in 24 hours</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold mb-1">Expert Service</h4>
              <p className="text-sm text-gray-500">25+ years experience</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold mb-1">Best Rates</h4>
              <p className="text-sm text-gray-500">Competitive pricing</p>
            </div>
          </div>

          <Link to="/" className="block mt-6">
            <button className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
              Back Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )

  if (currentStep === 'quote') {
    return <QuoteForm selectedCrane={selectedCrane} onSubmit={handleQuoteSubmit} onBack={() => setCurrentStep('landing')} />
  }

  if (currentStep === 'confirmation' && submittedData) {
    return renderConfirmation()
  }

  return renderLanding()
}

export default RequestFlow
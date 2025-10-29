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

interface Crane {
  model: string
  max_load: number
  max_height: number
  max_radius: number
  image_path: string
}

function RequestFlow() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'quote' | 'confirmation'>('landing')
  const [cranes, setCranes] = useState<Crane[]>([])
  const [selectedCrane, setSelectedCrane] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [submittedData, setSubmittedData] = useState<CraneData | null>(null)

  useEffect(() => {
    fetchAvailableCranes()
  }, [])

  const fetchAvailableCranes = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/cranes')
      
      if (!response.ok) {
        throw new Error('Failed to fetch cranes')
      }
      
      const data = await response.json()
      setCranes(data)
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
        <div className="max-w-7xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Request Crane</h1>
            <p className="text-gray-500 mb-6">Select a crane and request a quote instantly</p>
            
            <Link to="/wizard-flow" className="inline-block">
              <button className="font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800">
                Need Help Choosing? Use Crane Finder
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading cranes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cranes.map((crane) => (
                <div 
                  key={crane.model}
                  onClick={() => setSelectedCrane(crane.model)}
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                    selectedCrane === crane.model ? 'ring-4 ring-red-700' : ''
                  }`}
                >
                  <div className="relative h-100 bg-gray-200">
                    <img 
                      src={`http://localhost:8080/${crane.image_path}`}
                      alt={crane.model}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Crane+Image';
                      }}
                    />
                    {selectedCrane === crane.model && (
                      <div className="absolute top-2 right-2 bg-red-700 text-white rounded-full p-2">
                        <span className="text-xl">✓</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{crane.model}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Max Load:</strong> {crane.max_load > 0 ? `${crane.max_load} tons` : 'Contact Us'}</p>
                      <p><strong>Max Height:</strong> {crane.max_height > 0 ? `${crane.max_height} ft` : 'Contact Us'}</p>
                      <p><strong>Max Radius:</strong> {crane.max_radius > 0 ? `${crane.max_radius} ft` : 'Contact Us'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCrane && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleQuoteRequest}
                className="font-semibold py-4 px-8 rounded-lg transition-colors border-none cursor-pointer bg-red-700 text-white hover:bg-red-800 text-lg"
              >
                Request Quote for {selectedCrane}
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <Link to="/">
              <button className="font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                Back Home
              </button>
            </Link>
          </div>
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
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../shared/Header'
import ConfirmationScreen from '../shared/ConfirmationScreen'
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

  // Confirmation Screen
  if (currentStep === 'confirmation' && submittedData) {
    return (
      <ConfirmationScreen
        craneName={submittedData.crane}
        customerName={submittedData.name}
        email={submittedData.email}
        phone={submittedData.phone}
        company={submittedData.company}
        onStartOver={handleStartOver}
      />
    )
  }

  // Quote Form
  if (currentStep === 'quote') {
    return <QuoteForm selectedCrane={selectedCrane} onSubmit={handleQuoteSubmit} onBack={() => setCurrentStep('landing')} />
  }

  // Landing Page - Crane Selection
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
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
                      className="w-full h-full object-cover object-bottom"
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
}

export default RequestFlow
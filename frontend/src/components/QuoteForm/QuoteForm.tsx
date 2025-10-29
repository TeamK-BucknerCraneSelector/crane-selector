import { useState } from 'react'
import Header from '../shared/Header'

interface QuoteFormProps {
  selectedCrane?: string
  onSubmit: (data: FormData) => void
  onBack: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  projectDetails: string
}

function QuoteForm({ selectedCrane, onSubmit, onBack }: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: ''
  })
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8080/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crane: selectedCrane,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectDetails: formData.projectDetails,
          sourceFlow: 'Request Flow'
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        console.log('Quote submitted to Salesforce:', data)
        onSubmit(formData)
      } else {
        throw new Error(data.error || 'Failed to submit quote')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Failed to submit quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Request Your Quote</h1>
            <p className="text-gray-500 mb-4">
              Fill out the form below and we'll get back to you with a competitive quote for your crane rental needs.
            </p>
            
            {selectedCrane && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Your Selection:</h4>
                <p className="text-gray-700">
                  Crane: <strong>{selectedCrane}</strong>
                </p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name (optional)"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2">Project Details *</label>
              <textarea
                name="projectDetails"
                value={formData.projectDetails}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please describe your project, timeline, location, and any specific requirements..."
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent resize-vertical font-[inherit]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QuoteForm
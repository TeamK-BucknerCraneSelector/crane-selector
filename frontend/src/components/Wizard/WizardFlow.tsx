import { useState } from 'react'
import { Link } from 'react-router-dom'
import BucknerLogo from '../../assets/buckner.svg'
import { Badge } from "@radix-ui/themes"
import QuoteForm from '../QuoteForm/QuoteForm'

interface WizardData {
  projectType: string
  liftingHeight: string
  environment: string
}

interface CraneRecommendation {
  name: string
  tonnage: string
  description: string
  features: string[]
  bestFor: string
}

interface QuoteFormData {
  name: string
  email: string
  phone: string
  company: string
  projectDetails: string
}

type WizardStep = "landing" | "wizard" | "recommendations" | "quote" | "confirmation"

function WizardFlow() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("landing")
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    projectType: "",
    liftingHeight: "",
    environment: "",
  })
  const [recommendations, setRecommendations] = useState<CraneRecommendation[]>([])
  const [selectedCrane, setSelectedCrane] = useState<string>("")
  const [quoteData, setQuoteData] = useState<QuoteFormData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const projectTypes = [
    { value: "construction", label: "Construction" },
    { value: "industrial", label: "Industrial/Manufacturing" },
    { value: "infrastructure", label: "Infrastructure/Utilities" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial Development" },
    { value: "maintenance", label: "Maintenance/Repair" },
  ]

  const liftingHeights = [
    { value: "0-30", label: "0-30 feet" },
    { value: "30-60", label: "30-60 feet" },
    { value: "60-100", label: "60-100 feet" },
    { value: "100-150", label: "100-150 feet" },
    { value: "150+", label: "150+ feet" },
  ]

  const environments = [
    { value: "urban", label: "Urban/City" },
    { value: "suburban", label: "Suburban" },
    { value: "rural", label: "Rural/Remote" },
    { value: "industrial", label: "Industrial Site" },
    { value: "waterfront", label: "Waterfront/Marine" },
  ]

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRecommendations(getLocalRecommendations())
      setCurrentStep("recommendations")
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLocalRecommendations = (): CraneRecommendation[] => {
    const recommendations: CraneRecommendation[] = []

    if (wizardData.liftingHeight === "0-30" && wizardData.projectType === "residential") {
      recommendations.push({
        name: "Mobile Hydraulic Crane",
        tonnage: "15-25 Ton",
        description: "Perfect for residential projects with moderate lifting requirements",
        features: ["Quick setup", "Compact footprint", "Road-mobile"],
        bestFor: "Small to medium residential construction"
      })
    }

    if (wizardData.liftingHeight === "60-100" || wizardData.liftingHeight === "100-150") {
      recommendations.push({
        name: "Tower Crane",
        tonnage: "40-60 Ton",
        description: "Ideal for high-rise construction with excellent reach and capacity",
        features: ["Maximum height capability", "360° rotation", "High capacity"],
        bestFor: "Multi-story construction projects"
      })
    }

    if (wizardData.projectType === "industrial" || wizardData.environment === "industrial") {
      recommendations.push({
        name: "All-Terrain Crane",
        tonnage: "50-100 Ton",
        description: "Versatile crane suitable for various industrial applications",
        features: ["All-terrain mobility", "Extended reach", "Heavy lifting capacity"],
        bestFor: "Industrial and infrastructure projects"
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        name: "Hydraulic Truck Crane",
        tonnage: "20-40 Ton",
        description: "Versatile general-purpose crane suitable for most applications",
        features: ["Mobile operation", "Quick deployment", "Flexible configuration"],
        bestFor: "General construction and maintenance"
      })
    }

    return recommendations
  }

  const handleStartWizard = () => {
    setCurrentStep("wizard")
    setWizardStep(1)
  }

  const handleWizardChange = (field: keyof WizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }))
  }

  const handleWizardNext = async () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1)
    } else {
      await fetchRecommendations()
    }
  }

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    } else {
      setCurrentStep("landing")
    }
  }

  const canProceed = () => {
    if (wizardStep === 1) return wizardData.projectType !== ""
    if (wizardStep === 2) return wizardData.liftingHeight !== ""
    if (wizardStep === 3) return wizardData.environment !== ""
    return false
  }

  const handleSelectCrane = (crane: CraneRecommendation) => {
    setSelectedCrane(crane.name)
    setCurrentStep("quote")
  }

  const handleQuoteSubmit = (data: any) => {
    setQuoteData(data)
    setCurrentStep("confirmation")
  }

  const handleStartOver = () => {
    setCurrentStep("landing")
    setWizardStep(1)
    setWizardData({ projectType: "", liftingHeight: "", environment: "" })
    setSelectedCrane("")
    setQuoteData(null)
    setRecommendations([])
  }

  if (currentStep === "confirmation" && quoteData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
          <Link className="my-auto px-2" to="/">
            <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
          </Link>
        </header>

        <div className="flex flex-col items-center justify-center flex-grow p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl text-green-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-center">Quote Request Submitted!</h1>
            <p className="text-gray-500 mb-6 text-center">
              Thank you! We'll contact you within 24 hours with a detailed quote.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-bold mb-3">Request Details:</h3>
              <p className="mb-2"><strong>Crane:</strong> {selectedCrane}</p>
              <p className="mb-2"><strong>Name:</strong> {quoteData.name}</p>
              <p className="mb-2"><strong>Email:</strong> {quoteData.email}</p>
              <p className="mb-2"><strong>Phone:</strong> {quoteData.phone}</p>
              {quoteData.company && <p className="mb-2"><strong>Company:</strong> {quoteData.company}</p>}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleStartOver} 
                className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
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

  if (currentStep === "quote") {
    return (
      <QuoteForm
        selectedCrane={selectedCrane}
        onSubmit={handleQuoteSubmit}
        onBack={() => setCurrentStep("recommendations")}
      />
    )
  }

  if (currentStep === "recommendations") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
          <Link className="my-auto px-2" to="/">
            <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
          </Link>
        </header>

        <div className="max-w-5xl mx-auto p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recommended Cranes</h1>
            <p className="text-gray-500">Based on your project requirements</p>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            {recommendations.map((crane, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-semibold m-0">{crane.name}</h3>
                    <Badge>{crane.tonnage}</Badge>
                  </div>
                  <p className="text-gray-500 m-0">{crane.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {crane.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm text-gray-500">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Best For:</h4>
                    <p className="text-sm text-gray-500 m-0">{crane.bestFor}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => handleSelectCrane(crane)}
                    className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
                  >
                    Select This Crane
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">Get a personalized quote</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { setCurrentStep("wizard"); setWizardStep(3) }}
              className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              ← Modify Requirements
            </button>
            <button 
              onClick={handleStartOver} 
              className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "wizard") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
          <Link className="my-auto px-2" to="/">
            <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
          </Link>
        </header>

        <div className="flex flex-col items-center justify-center flex-grow p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Crane Finder Wizard</h1>
              <p className="text-gray-500">Step {wizardStep} of 3</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className={wizardStep >= 1 ? "text-gray-700 font-semibold" : ""}>Project Type</span>
                <span className={wizardStep >= 2 ? "text-gray-700 font-semibold" : ""}>Lifting Height</span>
                <span className={wizardStep >= 3 ? "text-gray-700 font-semibold" : ""}>Environment</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 transition-[width] duration-300"
                  style={{ width: `${(wizardStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              {wizardStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What type of project are you working on?</h2>
                  <p className="text-gray-500 mb-4">This helps us recommend the most suitable crane type.</p>
                  <select
                    value={wizardData.projectType}
                    onChange={(e) => handleWizardChange("projectType", e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base outline-none focus:border-gray-700 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {wizardStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What's your required lifting height?</h2>
                  <p className="text-gray-500 mb-4">Consider the maximum height including obstacles.</p>
                  <select
                    value={wizardData.liftingHeight}
                    onChange={(e) => handleWizardChange("liftingHeight", e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base outline-none focus:border-gray-700 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select lifting height</option>
                    {liftingHeights.map((height) => (
                      <option key={height.value} value={height.value}>
                        {height.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {wizardStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What's your work environment?</h2>
                  <p className="text-gray-500 mb-4">The environment affects crane mobility and setup.</p>
                  <select
                    value={wizardData.environment}
                    onChange={(e) => handleWizardChange("environment", e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base outline-none focus:border-gray-700 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select environment</option>
                    {environments.map((env) => (
                      <option key={env.value} value={env.value}>
                        {env.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleWizardBack} 
                className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
              >
                {wizardStep === 1 ? "← Back to Start" : "← Previous"}
              </button>
              <button
                onClick={handleWizardNext}
                disabled={!canProceed() || loading}
                className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Loading..." : wizardStep === 3 ? "See Recommendations →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors hover:text-gray-600 tracking-wider shadow-sm">
        <Link className="my-auto px-2" to="/">
          <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
        </Link>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Crane Finder Wizard</h1>
          <div className="block mx-auto mb-4 text-center">
            <Badge>Needs Guidance</Badge>
          </div>
          <p className="text-base text-gray-500 mb-6 text-center">
            Answer a few questions to find the perfect crane for your project
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-4">How it works:</h3>
            <ol className="pl-5 flex flex-col gap-2">
              <li>Tell us about your project type</li>
              <li>Specify required lifting height</li>
              <li>Describe your work environment</li>
              <li>Get AI-powered crane recommendations</li>
              <li>Request a quote for your chosen crane</li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleStartWizard} 
              className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
            >
              Start Crane Finder
            </button>

            <Link to="/">
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

export default WizardFlow
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from "@radix-ui/themes"
import Header from '../shared/Header'
import ConfirmationScreen from '../shared/ConfirmationScreen'
import QuoteForm from '../QuoteForm/QuoteForm'

interface WizardData {
  projectType: string
  weight: string
  liftingHeight: string
  radius: string
  environment: string
}

interface CraneRecommendation {
  name: string
  tonnage: string
  description: string
  features: string[]
  bestFor: string
  imagePath: string
  specs: {
    maxLoad: number
    maxHeight: number
    maxRadius: number
  }
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
    weight: "",
    liftingHeight: "",
    radius: "",
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

  const weightRanges = [
    { value: "0-50", label: "0-50 tons (Light loads)" },
    { value: "50-150", label: "50-150 tons (Medium loads)" },
    { value: "150-300", label: "150-300 tons (Heavy loads)" },
    { value: "300-600", label: "300-600 tons (Very heavy loads)" },
    { value: "600+", label: "600+ tons (Ultra-heavy loads)" },
  ]

  const liftingHeights = [
    { value: "0-100", label: "0-100 feet (Low rise)" },
    { value: "100-200", label: "100-200 feet (Mid rise)" },
    { value: "200-400", label: "200-400 feet (High rise)" },
    { value: "400-600", label: "400-600 feet (Very high rise)" },
    { value: "600+", label: "600+ feet (Ultra high rise)" },
  ]

  const radiusRanges = [
    { value: "0-100", label: "0-100 feet (Short reach)" },
    { value: "100-200", label: "100-200 feet (Medium reach)" },
    { value: "200-400", label: "200-400 feet (Long reach)" },
    { value: "400-600", label: "400-600 feet (Very long reach)" },
    { value: "600+", label: "600+ feet (Ultra long reach)" },
  ]

  const environments = [
    { value: "urban", label: "Urban/City (Tight spaces)" },
    { value: "suburban", label: "Suburban (Moderate space)" },
    { value: "rural", label: "Rural/Remote (Open space)" },
    { value: "industrial", label: "Industrial Site (Heavy-duty)" },
    { value: "waterfront", label: "Waterfront/Marine (Special requirements)" },
  ]

  const getBestForText = (projectType: string): string => {
    const texts: Record<string, string> = {
      'residential': 'Residential construction projects',
      'construction': 'General construction work',
      'industrial': 'Industrial and heavy manufacturing',
      'infrastructure': 'Infrastructure and utilities projects',
      'commercial': 'Commercial development',
      'maintenance': 'Maintenance and repair work'
    }
    return texts[projectType] || 'Various construction projects'
  }

  const parseRange = (range: string): number => {
    if (range.includes('+')) {
      const base = parseInt(range.replace('+', ''))
      return base
    }
    const parts = range.split('-')
    return parseInt(parts[1])
  }

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const weight = parseRange(wizardData.weight)
      const height = parseRange(wizardData.liftingHeight)
      const radius = parseRange(wizardData.radius)
      
      const response = await fetch(
        `http://localhost:8080/api/recommendation?weight=${weight}&height=${height}&radius=${radius}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      const cranes = await response.json()
      
      const transformedRecommendations: CraneRecommendation[] = cranes.map((crane: any) => {
        const features = [
          `Max Load: ${crane.max_load} tons`,
          `Max Height: ${crane.max_height}ft`,
          `Max Radius: ${crane.max_radius}ft`
        ]

        if (wizardData.environment === 'urban') {
          features.push('Suitable for tight spaces')
        } else if (wizardData.environment === 'industrial') {
          features.push('Heavy-duty construction')
        } else if (wizardData.environment === 'waterfront') {
          features.push('Marine-rated equipment')
        }

        return {
          name: crane.model,
          tonnage: `${crane.max_load} Ton`,
          description: `Maximum load capacity of ${crane.max_load} tons with ${crane.max_height}ft height and ${crane.max_radius}ft reach capability`,
          features,
          bestFor: getBestForText(wizardData.projectType),
          imagePath: crane.image_path,
          specs: {
            maxLoad: crane.max_load,
            maxHeight: crane.max_height,
            maxRadius: crane.max_radius
          }
        }
      })
      
      setRecommendations(transformedRecommendations)
      setCurrentStep("recommendations")
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      alert('Failed to fetch recommendations from server. Please check that your backend is running.')
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const handleStartWizard = () => {
    setCurrentStep("wizard")
    setWizardStep(1)
  }

  const handleWizardChange = (field: keyof WizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }))
  }

  const handleWizardNext = async () => {
    if (wizardStep < 5) {
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
    if (wizardStep === 2) return wizardData.weight !== ""
    if (wizardStep === 3) return wizardData.liftingHeight !== ""
    if (wizardStep === 4) return wizardData.radius !== ""
    if (wizardStep === 5) return wizardData.environment !== ""
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
    setWizardData({ projectType: "", weight: "", liftingHeight: "", radius: "", environment: "" })
    setSelectedCrane("")
    setQuoteData(null)
    setRecommendations([])
  }

  // Confirmation Screen
  if (currentStep === "confirmation" && quoteData) {
    return (
      <ConfirmationScreen
        craneName={selectedCrane}
        customerName={quoteData.name}
        email={quoteData.email}
        phone={quoteData.phone}
        company={quoteData.company}
        onStartOver={handleStartOver}
      />
    )
  }

  // Quote Form
  if (currentStep === "quote") {
    return (
      <QuoteForm
        selectedCrane={selectedCrane}
        onSubmit={handleQuoteSubmit}
        onBack={() => setCurrentStep("recommendations")}
      />
    )
  }

  // Recommendations Page
  if (currentStep === "recommendations") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-5xl mx-auto p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recommended Cranes</h1>
            <p className="text-gray-500">Based on your project requirements</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>Requirements: {parseRange(wizardData.weight)} tons • {parseRange(wizardData.liftingHeight)}ft height • {parseRange(wizardData.radius)}ft radius</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            {recommendations.length > 0 ? (
              recommendations.map((crane, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[auto_2fr_1fr] gap-6">
                  
                  <div className="relative w-full md:w-64 h-auto md:h-full bg-gray-200">
                    <img 
                      src={`http://localhost:8080/${crane.imagePath}`}
                      alt={crane.name}
                      className="w-full h-full object-cover object-bottom"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Crane';
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 p-6">
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

                  <div className="flex flex-col justify-center items-center p-6">
                    <button
                      onClick={() => handleSelectCrane(crane)}
                      className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
                    >
                      Select This Crane
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">Get a personalized quote</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-4">No cranes match your exact requirements.</p>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your weight, height, or radius requirements.</p>
                <button
                  onClick={() => { setCurrentStep("wizard"); setWizardStep(2) }}
                  className="font-semibold py-2 px-4 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
                >
                  Adjust Requirements
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { setCurrentStep("wizard"); setWizardStep(5) }}
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

  // Wizard Steps
  if (currentStep === "wizard") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <div className="flex flex-col items-center justify-center flex-grow p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Crane Finder Wizard</h1>
              <p className="text-gray-500">Step {wizardStep} of 5</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span className={wizardStep >= 1 ? "text-gray-700 font-semibold" : ""}>Project</span>
                <span className={wizardStep >= 2 ? "text-gray-700 font-semibold" : ""}>Weight</span>
                <span className={wizardStep >= 3 ? "text-gray-700 font-semibold" : ""}>Height</span>
                <span className={wizardStep >= 4 ? "text-gray-700 font-semibold" : ""}>Radius</span>
                <span className={wizardStep >= 5 ? "text-gray-700 font-semibold" : ""}>Environment</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 transition-[width] duration-300"
                  style={{ width: `${(wizardStep / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              {wizardStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What type of project are you working on?</h2>
                  <p className="text-gray-500 mb-4">This helps us understand your lifting requirements.</p>
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
                  <h2 className="text-xl font-semibold mb-2">What's the maximum weight you need to lift?</h2>
                  <p className="text-gray-500 mb-4">Consider the heaviest single load for your project.</p>
                  <select
                    value={wizardData.weight}
                    onChange={(e) => handleWizardChange("weight", e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base outline-none focus:border-gray-700 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select weight range</option>
                    {weightRanges.map((weight) => (
                      <option key={weight.value} value={weight.value}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {wizardStep === 3 && (
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

              {wizardStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What's your required horizontal reach?</h2>
                  <p className="text-gray-500 mb-4">How far from the crane does the load need to be lifted?</p>
                  <select
                    value={wizardData.radius}
                    onChange={(e) => handleWizardChange("radius", e.target.value)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base outline-none focus:border-gray-700 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select radius range</option>
                    {radiusRanges.map((radius) => (
                      <option key={radius.value} value={radius.value}>
                        {radius.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {wizardStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">What's your work environment?</h2>
                  <p className="text-gray-500 mb-4">The environment affects crane mobility and setup requirements.</p>
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
                {loading ? "Loading..." : wizardStep === 5 ? "See Recommendations →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Landing Page
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

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
              <li>Specify maximum weight requirements</li>
              <li>Specify required lifting height</li>
              <li>Specify horizontal reach needed</li>
              <li>Describe your work environment</li>
              <li>Get precise crane recommendations</li>
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
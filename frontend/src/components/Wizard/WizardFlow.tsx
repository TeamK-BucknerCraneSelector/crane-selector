import { useState } from 'react'
import ConfirmationScreen from '../shared/ConfirmationScreen'
import QuoteForm from '../QuoteForm/QuoteForm'
import WizardLanding from './WizardLanding'
import WizardSteps from './WizardSteps'
import RecommendationsPage from './RecommendationsPage'


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
  const API_URL = import.meta.env.VITE_API_URL
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

  // Helper function to get "Best For" text based on project type
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

  // Parse range string to get upper bound value
  const parseRange = (range: string): number => {
    if (range.includes('+')) {
      const base = parseInt(range.replace('+', ''))
      return base
    }
    const parts = range.split('-')
    return parseInt(parts[1])
  }

  // Fetch crane recommendations from backend
  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const weight = parseRange(wizardData.weight)
      const height = parseRange(wizardData.liftingHeight)
      const radius = parseRange(wizardData.radius)
      
      const response = await fetch(
        `${API_URL}/api/recommendation?weight=${weight}&height=${height}&radius=${radius}`      
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

  // Event Handlers
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

  // Render appropriate component based on current step
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
      <RecommendationsPage
        recommendations={recommendations}
        requirements={{
          weight: parseRange(wizardData.weight),
          height: parseRange(wizardData.liftingHeight),
          radius: parseRange(wizardData.radius)
        }}
        apiUrl={API_URL}
        onSelectCrane={handleSelectCrane}
        onModifyRequirements={() => { setCurrentStep("wizard"); setWizardStep(5) }}
        onAdjustRequirements={() => { setCurrentStep("wizard"); setWizardStep(2) }}
        onStartOver={handleStartOver}
      />
    )
  }

  if (currentStep === "wizard") {
    return (
      <WizardSteps
        wizardStep={wizardStep}
        wizardData={wizardData}
        loading={loading}
        onWizardChange={handleWizardChange}
        onWizardNext={handleWizardNext}
        onWizardBack={handleWizardBack}
        canProceed={canProceed()}
      />
    )
  }

  // Default: Landing Page
  return <WizardLanding onStartWizard={handleStartWizard} />
}

export default WizardFlow
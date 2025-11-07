import Header from '../shared/Header'
import HeroSection from '../shared/HeroSection'

interface WizardData {
  projectType: string
  weight: string
  liftingHeight: string
  radius: string
  environment: string
}

interface WizardStepsProps {
  wizardStep: number
  wizardData: WizardData
  loading: boolean
  onWizardChange: (field: keyof WizardData, value: string) => void
  onWizardNext: () => void
  onWizardBack: () => void
  canProceed: boolean
}

function WizardSteps({
  wizardStep,
  wizardData,
  loading,
  onWizardChange,
  onWizardNext,
  onWizardBack,
  canProceed
}: WizardStepsProps) {
  
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <HeroSection 
        title="FIND YOUR SOLUTION"
        height='h-72'
      />

      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Crane Finder Wizard</h1>
            <p className="text-gray-500">Step {wizardStep} of 5</p>
          </div>

          {/* Progress Bar */}
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

          {/* Step Content */}
          <div className="mb-8">
            {wizardStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">What type of project are you working on?</h2>
                <p className="text-gray-500 mb-4">This helps us understand your lifting requirements.</p>
                <select
                  value={wizardData.projectType}
                  onChange={(e) => onWizardChange("projectType", e.target.value)}
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
                  onChange={(e) => onWizardChange("weight", e.target.value)}
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
                  onChange={(e) => onWizardChange("liftingHeight", e.target.value)}
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
                  onChange={(e) => onWizardChange("radius", e.target.value)}
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
                  onChange={(e) => onWizardChange("environment", e.target.value)}
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

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onWizardBack} 
              className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
            >
              {wizardStep === 1 ? "← Back to Start" : "← Previous"}
            </button>
            <button
              onClick={onWizardNext}
              disabled={!canProceed || loading}
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

export default WizardSteps
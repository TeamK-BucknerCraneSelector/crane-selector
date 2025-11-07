import { Link } from 'react-router-dom'
import Header from '../shared/Header'
import HeroSection from '../shared/HeroSection'

interface WizardLandingProps {
  onStartWizard: () => void
}

function WizardLanding({ onStartWizard }: WizardLandingProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <HeroSection 
        title="FIND YOUR SOLUTION"
        height='h-72'
      />

      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-1 text-center">Crane Finder Wizard</h1>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Answer a few questions to find the perfect crane for your project
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-2 text-sm">How it works:</h3>
            <ol className="pl-5 flex flex-col gap-1 text-sm">
              <li>Tell us about your project type</li>
              <li>Specify maximum weight requirements</li>
              <li>Specify required lifting height</li>
              <li>Specify horizontal reach needed</li>
              <li>Describe your work environment</li>
              <li>Get precise crane recommendations</li>
              <li>Request a quote for your chosen crane</li>
            </ol>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={onStartWizard} 
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

export default WizardLanding
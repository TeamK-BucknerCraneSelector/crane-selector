import { Badge } from "@radix-ui/themes"
import Header from '../shared/Header'
import HeroSection from "../shared/HeroSection"

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

interface RecommendationsPageProps {
  recommendations: CraneRecommendation[]
  requirements: {
    weight: number
    height: number
    radius: number
  }
  apiUrl: string
  onSelectCrane: (crane: CraneRecommendation) => void
  onModifyRequirements: () => void
  onAdjustRequirements: () => void
  onStartOver: () => void
}

function RecommendationsPage({
  recommendations,
  requirements,
  apiUrl,
  onSelectCrane,
  onModifyRequirements,
  onAdjustRequirements,
  onStartOver
}: RecommendationsPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <HeroSection 
        title="FIND YOUR SOLUTION"
        height='h-72'
      />

      <div className="max-w-5xl mx-auto p-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Recommended Cranes</h1>
          <p className="text-gray-500">Based on your project requirements</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Requirements: {requirements.weight} tons • {requirements.height}ft height • {requirements.radius}ft radius</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          {recommendations.length > 0 ? (
            recommendations.map((crane, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[auto_2fr_1fr] gap-6">
                
                {/* Crane Image */}
                <div className="relative w-full md:w-64 h-auto md:h-full bg-gray-200">
                  <img 
                    src={`${apiUrl}/${crane.imagePath}`}
                    alt={crane.name}
                    className="w-full h-full object-cover object-bottom"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Crane';
                    }}
                  />
                </div>

                {/* Crane Details */}
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

                {/* Select Button */}
                <div className="flex flex-col justify-center items-center p-6">
                  <button
                    onClick={() => onSelectCrane(crane)}
                    className="w-full font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
                  >
                    Select This Crane
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">Get a personalized quote</p>
                </div>
              </div>
            ))
          ) : (
            // No Results
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-4">No cranes match your exact requirements.</p>
              <p className="text-sm text-gray-400 mb-4">Try adjusting your weight, height, or radius requirements.</p>
              <button
                onClick={onAdjustRequirements}
                className="font-semibold py-2 px-4 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
              >
                Adjust Requirements
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onModifyRequirements}
            className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
          >
            ← Modify Requirements
          </button>
          <button 
            onClick={onStartOver} 
            className="flex-1 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsPage
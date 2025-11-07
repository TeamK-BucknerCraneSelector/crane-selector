import { Link } from 'react-router-dom'
import { Card } from "@radix-ui/themes"
import { Badge } from "@radix-ui/themes"

import Header from '../shared/Header'
import HeroSection from '../shared/HeroSection'


function Home() {
  return (
    <div className="flex flex-col">
      <Header />

      <HeroSection 
        title="FIND YOUR SOLUTION"
        height='h-72'
      />

      {/* Cards Section */}
      <section className="flex flex-col w-full">
        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Request Crane Card */}
            <Card className="h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Request Crane</div>
                  <Badge style={{ backgroundColor: '#6B1B1F', color: 'white' }}>Specific Crane</Badge>
                </div>
                <p className="text-gray-500 mb-4">
                  Perfect for customers who already know which crane model they need
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Best For Section */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <ul className="text-sm text-gray-500 list-none p-0 flex flex-col gap-1">
                    <li>• Experienced contractors</li>
                    <li>• Repeat customers</li>
                    <li>• Users with specific requirements</li>
                  </ul>
                </div>

                <Link to="/request-flow">
                  <button className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#6B1B1F' }}>
                    Request Crane
                  </button>
                </Link>
              </div>
            </Card>

            {/* Crane Wizard Card */}
            <Card className="h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Crane Wizard</div>
                  <Badge>Explore Options</Badge>
                </div>
                <p className="text-gray-500 mb-4">
                  Ideal for customers who need help choosing the right crane for their project
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Best For Section */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <ul className="text-sm text-gray-500 list-none p-0 flex flex-col gap-1">
                    <li>• First-time crane renters</li>
                    <li>• Complex project requirements</li>
                    <li>• Users needing expert guidance</li>
                  </ul>
                </div>

                <Link to="/wizard-flow">
                  <button className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-gray-700 hover:bg-gray-800">
                    Enter Crane Wizard
                  </button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
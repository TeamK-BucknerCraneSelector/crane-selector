import { Link } from 'react-router-dom'
import BucknerLogo from '../../assets/buckner.svg'
import { Card } from "@radix-ui/themes"
import { Badge } from "@radix-ui/themes"

function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors hover:text-gray-600 tracking-wider">
        <a className="my-auto px-2" href="https://bucknerheavylift.com">
          <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
        </a>
      </header>

      {/* Hero Section */}
      <section className="flex w-full h-full bg-crane-hero bg-center z-0">
        <div className="flex flex-col bg-black/50 w-full h-[32rem]">
          <div className="my-auto text-white text-center">
            <h1 className="text-4xl font-bold tracking-tight my-12">FIND YOUR SOLUTION</h1>
            <p className="text-base">Choose your experience to get started</p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="flex flex-col w-full">
        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Request Crane Card */}
            <Card className="h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Request Crane</div>
                  <Badge color="red">Knows What He Wants</Badge>
                </div>
                <p className="text-gray-500 mb-4">
                  Perfect for customers who already know which crane model they need
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Journey Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold mb-2">User Journey:</h4>
                  <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-red-700 text-white flex-shrink-0">1</span>
                      <span>Landing screen with crane selector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-red-700 text-white flex-shrink-0">2</span>
                      <span>Prominent "Request a Quote" button</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-red-700 text-white flex-shrink-0">3</span>
                      <span>Short quote form with contact details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-red-700 text-white flex-shrink-0">4</span>
                      <span>Confirmation screen</span>
                    </div>
                  </div>
                </div>

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
                  <button className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors border-none cursor-pointer bg-red-700 hover:bg-red-800">
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
                  <Badge>Needs Guidance</Badge>
                </div>
                <p className="text-gray-500 mb-4">
                  Ideal for customers who need help choosing the right crane for their project
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Journey Section */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold mb-2">User Journey:</h4>
                  <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-800 flex-shrink-0">1</span>
                      <span>Landing screen with "Start Crane Finder"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-800 flex-shrink-0">2</span>
                      <span>Multi-step wizard (project → height → environment)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-800 flex-shrink-0">3</span>
                      <span>Personalized crane recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-800 flex-shrink-0">4</span>
                      <span>Quote form and confirmation</span>
                    </div>
                  </div>
                </div>

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
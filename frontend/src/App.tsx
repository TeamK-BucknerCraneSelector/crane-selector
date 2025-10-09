import {useEffect, useState} from 'react'
import axios from 'axios'
import BucknerLogo from './assets/buckner.svg'

import { Card } from "@radix-ui/themes";
import { Badge } from "@radix-ui/themes";


import './App.css'

function App() {
  const [array, setArray] = useState([]);
    const fetchAPI = async () => {
      const response = await axios.get("http://localhost:8080/api");
      setArray(response.data.fruits);
      console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  })

  return (
    <>
      <div className="hidden">
        {array.map((fruit, index) => (
          <div key={index}>
            <p>{fruit}</p>
            <br></br>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <article className="flex flex-row h-18 fixed bg-white/90 w-full z-2 text-gray-900 hover:text-gray-600 transition-colors tracking-wide">
          <a className="my-auto px-2" href="https://bucknerheavylift.com">
            <img
              className={'w-auto h-8'}
              src={BucknerLogo}
              alt={'Buckner Logo'}
            />
          </a>
        </article>
        <article
          className="flex w-full h-full bg-[url(https://bucknerheavylift.com/wp-content/uploads/2016/07/internal-header-16-heavylift-1.jpg)] bg-center z-0">
          <div className="flex flex-col bg-black/50 w-full h-128">
            <div className="my-auto text-white">
              <div className='text-4xl font-bold tracking-tight my-12'>FIND YOUR SOLUTION</div>
              <div>Choose your experience to get started</div>
            </div>
          </div>
        </article>
        <article className="flex flex-col w-full">
          <div className="max-w-6xl mx-auto p-8">

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Connor Customer Flow */}
              <Card className="h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>Connor Customer</div>
                    <Badge color='red'>Knows What He Wants</Badge>
                  </div>
                  <div>
                    Perfect for customers who already know which crane model they need
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4>User Journey:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                        <span>Landing screen with crane selector</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                        <span>Prominent "Request a Quote" button</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                        <span>Short quote form with contact details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                        <span>Confirmation screen</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4>Best For:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Experienced contractors</li>
                      <li>• Repeat customers</li>
                      <li>• Users with specific requirements</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Eric Explorer Flow */}
              <Card className="h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>Eric Explorer</div>
                    <Badge>Needs Guidance</Badge>
                  </div>
                  <div>
                    Ideal for customers who need help choosing the right crane for their project
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4>User Journey:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                        <span>Landing screen with "Start Crane Finder"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                        <span>Multi-step wizard (project → height → environment)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                        <span>Personalized crane recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                        <span>Quote form and confirmation</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4>Best For:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• First-time crane renters</li>
                      <li>• Complex project requirements</li>
                      <li>• Users needing expert guidance</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

export default App;

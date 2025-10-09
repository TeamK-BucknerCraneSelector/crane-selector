import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import RequestFlow from './components/Request/RequestFlow'
import WizardFlow from './components/Wizard/WizardFlow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request-flow" element={<RequestFlow />} />
        <Route path="/wizard-flow" element={<WizardFlow />} />
      </Routes>
    </Router>
  )
}

export default App;
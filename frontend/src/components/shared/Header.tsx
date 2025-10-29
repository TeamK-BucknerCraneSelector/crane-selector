import { Link } from 'react-router-dom'
import BucknerLogo from '../../assets/buckner.svg'

function Header() {
  return (
    <header className="flex flex-row h-[4.5rem] bg-white/90 w-full z-[2] text-gray-800 transition-colors tracking-wider shadow-sm">
      <Link className="my-auto px-2" to="/">
        <img className="w-auto h-8" src={BucknerLogo} alt="Buckner Logo" />
      </Link>
    </header>
  )
}

export default Header
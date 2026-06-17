// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import PlanetDetail from './PlanetDetail'
import Trailer from './Trailer'
import LoginSignup from './LoginSignup'
import UserProfile from './UserProfile'
import ForgotPassword from './ForgotPassword'
import SpaceMysteries from './SpaceMysteries'
import Tickets from './Tickets'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planet/:name" element={<PlanetDetail />} />
        <Route path="/trailer" element={<Trailer />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/space-mysteries" element={<SpaceMysteries />} />
      </Routes>
    </Router>
  )
}

export default App
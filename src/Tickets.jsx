import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

// ===== TYPING ANIMATION COMPONENT =====
function TypingText({ text, className, delay = 0, speed = 80 }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [started, displayed, text, speed])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={className}>
      {displayed}
      <span 
        className="inline-block w-[2px] h-[1em] bg-white ml-1 align-middle"
        style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
      />
    </span>
  )
}

// ===== GLITCH TYPING ANIMATION =====
function GlitchTypingText({ text, className, delay = 0 }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started || isComplete) return

    let iteration = 0
    const finalText = text
    const totalIterations = finalText.length * 3

    const interval = setInterval(() => {
      setDisplayed(
        finalText
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char
            if (index < iteration / 3) {
              return finalText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      if (iteration >= totalIterations) {
        setIsComplete(true)
        setDisplayed(finalText)
        clearInterval(interval)
      }

      iteration += 1 / 2
    }, 40)

    return () => clearInterval(interval)
  }, [started, isComplete, text])

  return (
    <span className={className}>
      {displayed}
      {!isComplete && (
        <span className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 animate-pulse align-middle" />
      )}
    </span>
  )
}

// ===== DESTINATION CARD =====
function DestinationCard({ title, duration, difficulty, image, description, price, onSelect, isSelected }) {
  const [isHovered, setIsHovered] = useState(false)
  const difficultyColor = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-500 ${
        isSelected 
          ? "border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.3)]" 
          : "border-white/10 hover:border-cyan-400/40"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(title)}
    >
      {/* Glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative">
        <motion.div 
          className="h-48 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
        </motion.div>
        
        <div className="p-5 relative">
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{description}</p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                <span className="text-cyan-400">⏱</span> {duration}
              </span>
              <span className={`${difficultyColor[difficulty]}`}>
                <span className="mr-1">◆</span>{difficulty}
              </span>
            </div>
            <span className="text-cyan-400 font-bold">${price}M</span>
          </div>
        </div>
      </div>

      {/* Corner brackets on hover */}
      <motion.div
        className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/0"
        animate={{ borderColor: isHovered ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0)" }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/0"
        animate={{ borderColor: isHovered ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Selected indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

// ===== TICKET PREVIEW =====
function TicketPreview({ formData, isVisible }) {
  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative"
      >
        <div className="relative bg-gradient-to-br from-[#0a0e1a] to-[#050508] border border-cyan-500/30 rounded-2xl p-6 overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-50" />
          
          {/* Scanline */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-2"
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-cyan-400 font-bold tracking-wider text-sm">GALAXY EXPLORER</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Destination</span>
                <span className="text-white font-medium text-sm">{formData.destination || "—"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Passenger</span>
                <span className="text-white font-medium text-sm">{formData.fullName || "—"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Date</span>
                <span className="text-white font-medium text-sm">{formData.travelDate || "—"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Class</span>
                <span className={`font-medium text-sm ${
                  formData.travelClass === 'VIP' ? 'text-purple-400' : 
                  formData.travelClass === 'Business' ? 'text-yellow-400' : 'text-cyan-400'
                }`}>
                  {formData.travelClass || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Passengers</span>
                <span className="text-white font-medium text-sm">{formData.passengers || "—"}</span>
              </div>
            </div>

            {/* Barcode effect */}
            <div className="mt-4 flex gap-[2px] justify-center opacity-50">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="bg-white" style={{ width: Math.random() * 3 + 1, height: 20 }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ===== SUCCESS ANIMATION =====
function SuccessAnimation({ ticketData, onClose, onDownload }) {
  const [showRocket, setShowRocket] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRocket(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Rocket launch */}
      <AnimatePresence>
        {showRocket && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: -400, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, ease: "easeIn" }}
            className="absolute bottom-20"
          >
            <div className="relative">
              <svg width="40" height="80" viewBox="0 0 40 80" className="fill-white">
                <path d="M20 0 L28 20 L30 60 L20 70 L10 60 L12 20 Z" />
                <path d="M12 35 L5 50 L10 55 L12 40 Z" />
                <path d="M28 35 L35 50 L30 55 L28 40 Z" />
              </svg>
              {/* Flame */}
              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              >
                <div className="w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 20 }}
        className="relative text-center z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Ticket Booked Successfully!
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-6"
        >
          <p className="text-cyan-400 text-sm mb-1">Ticket ID: <span className="font-mono font-bold">{ticketData.ticketId}</span></p>
          <p className="text-gray-400 text-sm">Destination: <span className="text-white">{ticketData.destination}</span></p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="bg-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Ticket
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ===== RESPONSIVE NAVBAR =====
function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const navItems = [
    { name: "Planets", path: "/" },
    { name: "Trailer", path: "/trailer" },
    { name: "Tickets", path: "/tickets" },
    { name: "Space Mysteries", path: "/space-mysteries" },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer" 
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Galaxy<span className="text-cyan-400"> Explorer</span>
          </span>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item, i) => (
            <motion.li 
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium tracking-wide cursor-pointer transition-colors hover:text-cyan-400 text-gray-300"
            >
              {item.name}
            </motion.li>
          ))}
        </ul>

        {/* Desktop Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => user ? navigate("/profile") : navigate("/login")}
          className="hidden md:block bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-semibold transition-all"
        >
          {user ? "Profile" : "Enroll"}
        </motion.button>

        {/* Mobile Hamburger Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleNavClick(item.path)}
                  className="text-lg font-medium text-gray-300 hover:text-cyan-400 cursor-pointer py-2 border-b border-white/5"
                >
                  {item.name}
                </motion.div>
              ))}
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleNavClick(user ? "/profile" : "/login")
                }}
                className="w-full bg-cyan-500 text-white py-3 rounded-xl text-sm font-semibold mt-4"
              >
                {user ? "My Profile" : "Login / Signup"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ===== MAIN TICKETS PAGE =====
export default function Tickets() {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketData, setTicketData] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    destination: "",
    passengers: 1,
    travelDate: "",
    travelClass: "Economy"
  })

  const destinations = [
    {
      title: "Mars Expedition",
      duration: "7 Days",
      difficulty: "Medium",
      price: "2.5",
      image: "/images/mars.png",
      description: "Experience the red planet like never before. Walk on Martian soil and witness the Olympus Mons up close."
    },
    {
      title: "Moon Adventure",
      duration: "3 Days",
      difficulty: "Easy",
      price: "1.2",
      image: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=600&q=80",
      description: "A perfect starter journey to Earth's natural satellite. Visit the historic Apollo landing sites."
    },
    {
      title: "Saturn Rings Tour",
      duration: "14 Days",
      difficulty: "Hard",
      price: "8.5",
      image: "/images/saturn.png",
      description: "The ultimate deep space adventure. Cruise through the magnificent rings of Saturn."
    },
    {
      title: "Jupiter Flyby",
      duration: "10 Days",
      difficulty: "Hard",
      price: "5.8",
      image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80",
      description: "Witness the Great Red Spot and explore Jupiter's fascinating moon system including Europa."
    }
  ]

  // Check login status
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser)
      setUser(parsedUser)
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.name || "",
        email: parsedUser.email || ""
      }))
    }
    const timer = setTimeout(() => setHeroVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Update form when destination selected
  useEffect(() => {
    if (selectedDestination) {
      setFormData(prev => ({ ...prev, destination: selectedDestination }))
    }
  }, [selectedDestination])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBookTicket = () => {
    if (!formData.fullName || !formData.email || !formData.destination || !formData.travelDate) {
      return
    }

    const ticketId = `GX-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
    const newTicket = {
      ticketId,
      ...formData,
      status: "Confirmed",
      bookingDate: new Date().toISOString()
    }

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem("galaxyBookings") || "[]")
    localStorage.setItem("galaxyBookings", JSON.stringify([...existingBookings, newTicket]))

    setTicketData(newTicket)
    setShowSuccess(true)
  }

  const handleDownloadTicket = () => {
    const ticketText = `
================================
     GALAXY EXPLORER TICKET
================================
Ticket ID: ${ticketData.ticketId}
Destination: ${ticketData.destination}
Passenger: ${ticketData.fullName}
Email: ${ticketData.email}
Date: ${ticketData.travelDate}
Class: ${ticketData.travelClass}
Passengers: ${ticketData.passengers}
Status: Confirmed
================================
    Thank you for choosing
      Galaxy Explorer!
================================
    `
    const blob = new Blob([ticketText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${ticketData.ticketId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050508] text-white overflow-x-hidden">
      
      {/* ===== PARTICLE BACKGROUND ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255,255,255,${Math.random() * 0.5 + 0.2})`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.5)`
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ===== SUCCESS OVERLAY ===== */}
      <AnimatePresence>
        {showSuccess && ticketData && (
          <SuccessAnimation 
            ticketData={ticketData} 
            onClose={() => { 
              setShowSuccess(false); 
              setSelectedDestination(""); 
              setFormData({ 
                fullName: user?.name || "", 
                email: user?.email || "", 
                destination: "", 
                passengers: 1, 
                travelDate: "", 
                travelClass: "Economy" 
              }) 
            }}
            onDownload={handleDownloadTicket}
          />
        )}
      </AnimatePresence>

      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-[#050508] z-0" />
        
        {/* Floating Rocket */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="opacity-40"
          >
            <svg width="300" height="500" viewBox="0 0 100 180" className="fill-white/30">
              <path d="M50 0 L65 30 L70 140 L60 170 L50 180 L40 170 L30 140 L35 30 Z" />
              <path d="M30 80 L10 120 L20 130 L35 100 Z" />
              <path d="M70 80 L90 120 L80 130 L65 100 Z" />
              <rect x="42" y="40" width="16" height="25" rx="3" fill="#050508" />
              <rect x="42" y="70" width="16" height="20" rx="2" fill="#050508" />
            </svg>
          </motion.div>
        </motion.div>

        <div className="relative z-20 max-w-6xl mx-auto px-8 w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={heroVisible ? "visible" : "hidden"}
          >
            <motion.p 
              variants={fadeInUp}
              className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase"
            >
              {heroVisible && (
                <TypingText 
                  text="Space Travel Booking" 
                  speed={60} 
                  delay={0}
                />
              )}
            </motion.p>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ 
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)' 
              }}
            >
              {heroVisible && (
                <GlitchTypingText 
                  text="BOOK YOUR SPACE JOURNEY" 
                  delay={400}
                />
              )}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-gray-300 leading-relaxed mb-8 max-w-md text-sm"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {heroVisible && (
                <TypingText 
                  text="Choose your destination and start exploring the universe. From the Moon to Saturn's rings, your interstellar adventure awaits."
                  speed={15}
                  delay={1200}
                />
              )}
            </motion.p>

            <motion.div variants={fadeInUp}>
              {heroVisible && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection("destinations")}
                  className="bg-cyan-500 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-cyan-600 transition-all flex items-center gap-2 group"
                >
                  Book Now
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          <div />
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => scrollToSection("destinations")}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== AVAILABLE DESTINATIONS ===== */}
      <section id="destinations" className="relative py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Choose Your Adventure</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">AVAILABLE DESTINATIONS</h2>
            <div className="w-24 h-px bg-cyan-400/50 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.title}
                {...dest}
                isSelected={selectedDestination === dest.title}
                onSelect={setSelectedDestination}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKING SECTION ===== */}
      <section id="booking" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Secure Your Spot</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">BOOKING FORM</h2>
            <div className="w-24 h-px bg-cyan-400/50 mx-auto" />
          </motion.div>

          {!user ? (
            // Not logged in state
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto text-center"
            >
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-6"
                >
                  <svg className="w-16 h-16 mx-auto text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Please Login/Signup First</h3>
                <p className="text-gray-400 text-sm mb-8">You need to login to book your space journey.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="bg-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors"
                >
                  Login/Signup
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Logged in - show form
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Select Destination</label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0a0e1a]">Choose a destination...</option>
                        {destinations.map(dest => (
                          <option key={dest.title} value={dest.title} className="bg-[#0a0e1a]">{dest.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Number of Passengers</label>
                        <input
                          type="number"
                          name="passengers"
                          min="1"
                          max="10"
                          value={formData.passengers}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Travel Date</label>
                        <input
                          type="date"
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleFormChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 mb-3 block">Travel Class</label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Economy", "Business", "VIP"].map((cls) => (
                          <motion.button
                            key={cls}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData(prev => ({ ...prev, travelClass: cls }))}
                            className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                              formData.travelClass === cls
                                ? cls === 'VIP' 
                                  ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                                  : cls === 'Business'
                                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                                    : "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            {cls}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookTicket}
                      disabled={!formData.fullName || !formData.email || !formData.destination || !formData.travelDate}
                      className="w-full bg-cyan-500 text-white py-3.5 rounded-xl text-sm font-medium hover:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Book Ticket
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Ticket Preview */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:col-span-2 sticky top-28"
              >
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 text-center">Live Preview</p>
                <TicketPreview formData={formData} isVisible={true} />
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-8 text-center"
        >
          <motion.h2 
            className="text-3xl font-bold tracking-widest mb-8"
            whileHover={{ scale: 1.05 }}
          >
            GALAXY<span className="text-cyan-400"> EXPLORER</span>
          </motion.h2>
          
          <div className="flex justify-center gap-8 mb-8">
            {["TWITTER", "YOUTUBE", "INSTAGRAM", "LINKEDIN"].map((social, i) => (
              <motion.a 
                key={social} 
                href="#" 
                className="text-xs tracking-[4px] text-gray-500 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, color: "#22d3ee" }}
              >
                {social}
              </motion.a>
            ))}
          </div>

          <motion.p 
            className="text-gray-600 text-xs tracking-widest"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            GALAXY EXPLORER © 2023
          </motion.p>
        </motion.div>
      </footer>

    </div>
  )
}
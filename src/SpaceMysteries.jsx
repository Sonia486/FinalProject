import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
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

// ===== PARTICLE BACKGROUND =====
function SpaceParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.random() > 0.6 ? '78, 205, 196' : '255, 255, 255'}, ${Math.random() * 0.6 + 0.2})`,
            boxShadow: `0 0 ${Math.random() * 15 + 5}px rgba(${Math.random() > 0.6 ? '78, 205, 196' : '255, 255, 255'}, 0.5)`
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// ===== SHOOTING STAR =====
function ShootingStar() {
  return (
    <motion.div
      className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
      initial={{ x: "-10%", y: "10%", opacity: 0 }}
      animate={{ 
        x: "110%", 
        y: "60%", 
        opacity: [0, 1, 0] 
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        repeatDelay: 8 + Math.random() * 10,
        ease: "linear"
      }}
    />
  )
}

// ===== BLACK HOLE SVG ANIMATION =====
function BlackHoleAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <svg viewBox="0 0 400 400" className="w-full max-w-md drop-shadow-[0_0_50px_rgba(78,205,196,0.4)]">
          <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="url(#diskGradient)" strokeWidth="2" opacity="0.6" />
          <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="url(#diskGradient2)" strokeWidth="3" opacity="0.8" />
          <ellipse cx="200" cy="200" rx="120" ry="35" fill="none" stroke="url(#diskGradient3)" strokeWidth="4" opacity="0.9" />
          <circle cx="200" cy="200" r="40" fill="black" stroke="rgba(78,205,196,0.8)" strokeWidth="2" />
          <circle cx="200" cy="200" r="35" fill="none" stroke="rgba(78,205,196,0.4)" strokeWidth="1" />
          <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(255,200,100,0.6)" strokeWidth="1" strokeDasharray="5,5" />
          <defs>
            <linearGradient id="diskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#4ecdc4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="diskGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="diskGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffd93d" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />
    </div>
  )
}

// ===== MYSTERY CARD =====
function MysteryCard({ title, description, image, delay }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(78,205,196,0.2)]"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
        <motion.div
          className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/0"
          whileHover={{ borderColor: "rgba(34, 211, 238, 0.6)" }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/0"
          whileHover={{ borderColor: "rgba(34, 211, 238, 0.6)" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  )
}

// ===== TIMELINE ITEM =====
function TimelineItem({ year, title, description, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative flex items-center gap-8"
    >
      <div className="flex-shrink-0 w-24 text-right">
        <span className="text-2xl font-bold text-cyan-400">{year}</span>
      </div>
      
      <div className="relative flex-shrink-0 w-4 h-4">
        <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50" />
        <div className="relative w-4 h-4 bg-cyan-400 rounded-full border-2 border-white" />
      </div>
      
      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-400/30 transition-all">
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

// ===== DID YOU KNOW CARD =====
function FactCard({ fact, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(78,205,196,0.15)]"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
      >
        <p className="text-gray-300 text-sm leading-relaxed">{fact}</p>
      </motion.div>
      
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" />
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
    </motion.div>
  )
}

// ===== GALLERY MODAL =====
function GalleryModal({ isOpen, onClose, item }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-3xl w-full bg-[#0a0a12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-50" />
            
            <div className="relative p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white z-10"
              >
                ✕
              </button>
              
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full h-64 mb-6 rounded-lg overflow-hidden"
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </motion.div>
              
              <motion.h3 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4 text-white"
              >
                {item.title}
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 leading-relaxed text-sm"
              >
                {item.description}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ===== GALLERY CARD =====
function GalleryCard({ item, onClick, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={() => onClick(item)}
      className="group relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all duration-500"
    >
      <motion.img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h4 className="text-white font-bold text-sm">{item.title}</h4>
      </div>
      
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/0 group-hover:border-cyan-400/60 transition-all duration-300" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/0 group-hover:border-cyan-400/60 transition-all duration-300" />
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
    { name: "Space Mysteries", path: "/space-mysteries", active: true }
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
            Galaxy<span style={{ color: '#4ecdc4' }}> Explorer</span>
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
              className={`text-sm font-medium tracking-wide cursor-pointer transition-colors hover:text-cyan-400 ${
                item.active 
                  ? "text-white border-b-2 border-cyan-400 pb-1" 
                  : "text-gray-300"
              }`}
            >
              {item.name}
            </motion.li>
          ))}
        </ul>

        {/* Desktop Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
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
                  className={`text-lg font-medium cursor-pointer py-2 border-b border-white/5 ${
                    item.active ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
                  }`}
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
                className="w-full bg-white text-gray-900 py-3 rounded-xl text-sm font-semibold mt-4"
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

// ===== MAIN SPACE MYSTERIES PAGE =====
export default function SpaceMysteries() {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".mystery-hero-content", {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: ".mystery-hero",
          start: "top top",
          end: "50% top",
          scrub: 1,
        }
      })

      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const openModal = (item) => {
    setModalContent(item)
    setModalOpen(true)
  }

  const mysteries = [
    {
      title: "Alien Life",
      description: "Are we alone in the universe? Scientists discover new exoplanets every day — could an alien civilization be watching us right now?",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80"
    },
    {
      title: "Mysterious Signals",
      description: "Unknown radio signals from space. Fast Radio Bursts (FRBs) remain one of the greatest mysteries — are these alien messages?",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80"
    },
    {
      title: "Dark Matter",
      description: "The hidden matter of the universe that we cannot see, yet it exerts gravitational influence. It makes up 27% of the universe!",
      image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&q=80"
    },
    {
      title: "Dark Energy",
      description: "The mystery behind the expansion of the universe. Scientists still cannot understand why and at what speed the universe is expanding.",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80"
    },
    {
      title: "Lost Space Missions",
      description: "Missing or failed missions like Mars Climate Orbiter and Beagle 2. What happened to them? Did they make contact with something unknown?",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80"
    },
    {
      title: "Rogue Planets",
      description: "Planets that do not orbit any star — wandering alone through space. Could life exist on these wandering worlds?",
      image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80"
    }
  ]

  const timeline = [
    { year: "1977", title: "Wow! Signal", description: "A 72-second radio signal received by Ohio State University that remains unexplained to this day." },
    { year: "1990", title: "Hubble Discoveries", description: "The Hubble Space Telescope captured deep field images — billions of galaxies became visible." },
    { year: "2015", title: "Gravitational Waves", description: "LIGO detected gravitational waves for the first time — confirming Einstein's theory." },
    { year: "2019", title: "First Black Hole Image", description: "The Event Horizon Telescope captured the first real image of a black hole in the M87 galaxy." },
    { year: "2021", title: "UAP Report", description: "The Pentagon officially began investigating UFOs (UAPs) — could this be alien technology?" }
  ]

  const facts = [
    { fact: "Sound cannot travel in space because there is no air or medium. If you scream in space, no one will hear you!" },
    { fact: "A day on Venus (243 Earth days) is longer than its year (225 Earth days). That means the day is longer than the year!" },
    { fact: "A single spoonful of material from a neutron star weighs billions of tons. Even a tiny amount would be too heavy to lift!" },
    { fact: "When you look at the night sky, some stars you see no longer exist — their light traveled for years and the star has already died." }
  ]

  const gallery = [
    { title: "Black Hole", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", description: "Black holes are cosmic objects with gravity so strong that nothing — not even light — can escape. Nothing can return from beyond the event horizon." },
    { title: "Nebula", image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80", description: "Nebulae are giant clouds of dust and gas where new stars are born. The Orion Nebula is the most famous of them all." },
    { title: "Galaxy", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80", description: "Our Milky Way galaxy contains 100-400 billion stars. And there are over 2 trillion galaxies in the universe!" },
    { title: "Exoplanet", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80", description: "Exoplanets are planets outside our solar system. Over 5,000 exoplanets have been discovered so far." },
    { title: "Supernova", image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80", description: "A supernova is the explosive death of a star. The star's brightness increases billions of times — brighter than an entire galaxy!" },
    { title: "Wormhole", image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&q=80", description: "Wormholes are theoretical tunnels through spacetime connecting two distant points — time travel might even be possible!" }
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050508] text-white overflow-x-hidden">
      
      <SpaceParticles />
      
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <ShootingStar />
        <ShootingStar />
        <ShootingStar />
      </div>

      <GalleryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={modalContent || {}} 
      />

      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="mystery-hero relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-[#050508] z-0" />
        
        <div className="absolute inset-0 z-[1] opacity-40">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 60, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(78,205,196,0.1) 0%, transparent 70%)"
            }}
          />
        </div>

        <div className="mystery-hero-content relative z-20 max-w-6xl mx-auto px-8 w-full text-center">
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
                  text="Unexplained Phenomena" 
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
                  text="SPACE MYSTERIES" 
                  delay={400}
                />
              )}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto text-sm md:text-base"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {heroVisible && (
                <TypingText 
                  text="Discover the unexplained secrets hidden in the universe. From black holes to alien signals, explore the mysteries that keep scientists awake at night."
                  speed={20}
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
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(78,205,196,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 px-8 py-3 rounded-full text-sm font-medium hover:bg-cyan-500/30 transition-all flex items-center gap-2 mx-auto group"
                >
                  Explore Mysteries
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
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

      {/* ===== FEATURED MYSTERY: BLACK HOLES ===== */}
      <section id="featured" className="relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Featured Mystery</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">BLACK HOLES</h2>
            
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed max-w-md">
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all"
                whileHover={{ x: 5 }}
              >
                <h4 className="text-cyan-400 font-bold mb-1">What is a Black Hole?</h4>
                <p>A cosmic object with gravity so intense that nothing — not even light — can escape from it.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all"
                whileHover={{ x: 5 }}
              >
                <h4 className="text-cyan-400 font-bold mb-1">How is it Formed?</h4>
                <p>When a massive star reaches the end of its life, it collapses in a supernova explosion and becomes a black hole.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all"
                whileHover={{ x: 5 }}
              >
                <h4 className="text-cyan-400 font-bold mb-1">Why Can't Light Escape?</h4>
                <p>The escape velocity inside the event horizon exceeds the speed of light — that is why even light cannot get out!</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <BlackHoleAnimation />
            
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ 
                  rotate: 360,
                  x: [0, Math.cos(i * 2) * 100, 0],
                  y: [0, Math.sin(i * 2) * 30, 0]
                }}
                transition={{ 
                  duration: 8 + i * 2, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: i * 1
                }}
                style={{ marginLeft: -4, marginTop: -4 }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MYSTERY CARDS GRID ===== */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Cosmic Enigmas</p>
            <h2 className="text-4xl md:text-5xl font-bold">UNSOLVED MYSTERIES</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mysteries.map((mystery, i) => (
              <MysteryCard key={i} {...mystery} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MYSTERY TIMELINE ===== */}
      <section className="timeline-section relative py-32">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Through The Ages</p>
            <h2 className="text-4xl md:text-5xl font-bold">MYSTERY TIMELINE</h2>
          </motion.div>

          <div className="relative">
            <div className="timeline-line absolute left-[7.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-purple-500 to-cyan-400 md:block hidden" />
            
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <TimelineItem key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DID YOU KNOW? ===== */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Mind Blowing Facts</p>
            <h2 className="text-4xl md:text-5xl font-bold">DID YOU KNOW?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facts.map((fact, i) => (
              <FactCard key={i} {...fact} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== UNIVERSE GALLERY ===== */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Visual Journey</p>
            <h2 className="text-4xl md:text-5xl font-bold">UNIVERSE GALLERY</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item, i) => (
              <GalleryCard key={i} item={item} onClick={openModal} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="relative py-32 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to explore more?
          </motion.h2>
          
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            Discover real planets, moons, and celestial bodies in our interactive galaxy explorer.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(78,205,196,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest transition-all flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            GALAXY EXPLORER
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
        </motion.div>
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
            GALAXY EXPLORER &copy; 2023
          </motion.p>
        </motion.div>
      </footer>

    </div>
  )
}
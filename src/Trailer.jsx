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

// ===== NUMBER COUNTING ANIMATION COMPONENT =====
function AnimatedNumber({ value, className }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      
      const duration = 2500
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(2, -10 * progress)
        
        setCount(Math.floor(easeOut * value))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(value)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  )
}

// ===== READ MORE MODAL COMPONENT =====
function ReadMoreModal({ isOpen, onClose, title, content, image }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full bg-[#0a0a12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-50" />
            
            <div className="relative p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
              >
                ✕
              </button>
              
              {image && (
                <motion.div 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full h-48 mb-6 rounded-lg overflow-hidden"
                >
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                </motion.div>
              )}
              
              <motion.h3 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4 text-white"
              >
                {title}
              </motion.h3>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 leading-relaxed text-sm space-y-4"
              >
                {content}
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-6 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-2 rounded-full text-sm font-medium hover:bg-cyan-500/30 transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ===== IMAGE HOVER CARD =====
function ImageHoverCard({ src, alt, className = "" }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isHovered ? 1.15 : 1,
          filter: isHovered ? "brightness(1.1) contrast(1.1)" : "brightness(0.8) contrast(1.1)"
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Scanline effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-full w-full animate-scanline" />
      </motion.div>
      
      {/* Corner brackets */}
      <motion.div
        className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400/0"
        animate={{ borderColor: isHovered ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0)" }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400/0"
        animate={{ borderColor: isHovered ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0)" }}
        transition={{ duration: 0.3 }}
      />
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
    { name: "Trailer", path: "/trailer", active: true },
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

// ===== MAIN TRAILER PAGE =====
export default function Trailer() {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", content: "", image: "" })

  // Modal content data
  const modalData = {
    hero: {
      title: "SpaceX & NASA Partnership",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
      content: (
        <>
          <p>In 2020, SpaceX returned America's ability to fly NASA astronauts to and from the International Space Station on American vehicles for the first time since 2011.</p>
          <p>SpaceX's Dragon spacecraft has carried 42 people to orbit across various missions including:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-cyan-400/80">
            <li>Demo-2 (2020) - First crewed test flight</li>
            <li>Crew-1 through Crew-8 (2020-2024) - Operational ISS missions</li>
            <li>Inspiration4 (2021) - First all-civilian orbital mission</li>
            <li>Axiom Mission 1 (2022) - First private astronaut mission to ISS</li>
          </ul>
          <p className="mt-4">Dragon is the only spacecraft currently flying that is capable of returning significant amounts of cargo to Earth.</p>
        </>
      )
    },
    starlink: {
      title: "Starlink Mission Details",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80",
      content: (
        <>
          <p>On Friday, March 24 at 11:33 a.m. ET, Falcon 9 launched 56 Starlink satellites to low-Earth orbit from Space Launch Complex 40 at Cape Canaveral Space Force Station, Florida.</p>
          <p className="mt-4">This was the tenth launch and landing for this Falcon 9 first stage booster, which previously launched:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-cyan-400/80">
            <li>CRS-22 (June 2021)</li>
            <li>Crew-3 (November 2021)</li>
            <li>Turksat 5B (December 2021)</li>
            <li>Crew-4 (April 2022)</li>
            <li>CRS-25 (July 2022)</li>
            <li>Eutelsat HOTBIRD 13G (November 2022)</li>
            <li>mPOWER-a (December 2022)</li>
            <li>Three Starlink missions</li>
          </ul>
        </>
      )
    },
    lunar: {
      title: "NASA Lunar Exploration Program",
      image: "https://images.unsplash.com/photo-1541873676-a18131494184?w=600&q=80",
      content: (
        <>
          <p>On November 15, 2022, NASA announced that SpaceX's Starship was selected to support sustained lunar exploration as part of the Artemis program.</p>
          <p className="mt-4">Key mission objectives include:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-cyan-400/80">
            <li>Artemis III (2026) - First crewed lunar landing since Apollo 17</li>
            <li>Artemis IV (2028) - Gateway space station integration</li>
            <li>Sustained presence on the Moon</li>
            <li>Preparation for future Mars missions</li>
          </ul>
          <p className="mt-4">The $2.9 billion contract includes an uncrewed demonstration landing and the crewed lunar lander system.</p>
        </>
      )
    }
  }

  const openModal = (key) => {
    setModalContent(modalData[key])
    setModalOpen(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax effect
      gsap.to(".trailer-hero-content", {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: ".trailer-hero",
          start: "top top",
          end: "50% top",
          scrub: 1,
        }
      })

      // Satellite text reveal
      gsap.from(".satellite-text", {
        opacity: 0,
        x: -60,
        duration: 1,
        scrollTrigger: {
          trigger: ".satellite-section",
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      })

      // Rocket sections with enhanced animation
      gsap.utils.toArray(".rocket-section").forEach((section) => {
        gsap.from(section.querySelector(".rocket-img"), {
          scale: 0.8,
          opacity: 0,
          rotationY: 15,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        })
      })

      // Line draw animation
      gsap.from(".line-draw", {
        height: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".starship-section",
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      })

      // Stats counter trigger
      gsap.utils.toArray(".stats-section").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            section.classList.add("stats-active")
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

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

      {/* ===== MODAL ===== */}
      <ReadMoreModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        {...modalContent} 
      />

      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="trailer-hero relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-[#050508] z-0" />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.img 
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80" 
            alt="Astronaut"
            className="w-[500px] md:w-[700px] opacity-60 object-contain"
            style={{ filter: "brightness(0.4) contrast(1.2)" }}
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        <div className="trailer-hero-content relative z-20 max-w-6xl mx-auto px-8 w-full grid md:grid-cols-2 gap-12 items-center">
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
                  text="Space Exploration" 
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
                  text="TAKING HUMANS TO SPACE" 
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
                  text="In 2020, SpaceX returned America's ability to fly NASA astronauts to and from the International Space Station on American vehicles for the first time since 2011. In addition to flying astronauts to space for NASA, SpaceX's Dragon spacecraft can also carry commercial astronauts to Earth orbit, the ISS or beyond."
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
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal('hero')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2 group"
                >
                  Read more 
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </motion.svg>
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          <div />
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => scrollToSection("starlink")}
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

      {/* ===== STARLINK MISSION ===== */}
      <section id="starlink" className="satellite-section relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <motion.div 
                className="absolute inset-0 border border-white/10 rounded-full scale-150"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 border border-white/5 rounded-full scale-125"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80" 
                  alt="Starlink Satellite"
                  className="w-full object-contain relative z-10"
                  style={{ filter: "brightness(0.8) contrast(1.1)" }}
                />
              </motion.div>
            </div>
          </motion.div>

          <div className="satellite-text">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Latest Mission</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">STARLINK MISSION</h2>
              
              <p className="text-gray-400 leading-relaxed mb-6 text-sm max-w-md">
                On Friday, March 24 at 11:33 a.m. ET, Falcon 9 launched 56 Starlink satellites to low-Earth orbit from Space Launch Complex 40 at Cape Canaveral Space Force Station, Florida.
              </p>

              <p className="text-gray-500 leading-relaxed mb-8 text-xs max-w-md">
                This was the tenth launch and landing for this Falcon 9 first stage booster, which previously launched CRS-22, Crew-3, Turksat 5B, Crew-4, CRS-25, Eutelsat HOTBIRD 13G, mPOWER-a and now three Starlink missions.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openModal('starlink')}
                className="text-white border-b border-white/30 pb-1 text-sm tracking-widest hover:border-cyan-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                READ MORE
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FALCON HEAVY ===== */}
      <section className="rocket-section relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Heavy Lift</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">FALCON HEAVY</h2>
            <p className="text-cyan-400 text-sm tracking-widest mb-8">OVER 5 MILLION LBS OF THRUST</p>
            
            <div className="w-16 h-px bg-white/20 mb-8" />
            
            <p className="text-gray-400 leading-relaxed mb-6 text-sm max-w-md">
              With more than 5 million pounds of thrust at liftoff, Falcon Heavy is one of the most capable rockets flying. By comparison, the liftoff thrust of the Falcon Heavy equals approximately eighteen 747 aircraft at full power.
            </p>
            
            <p className="text-gray-500 leading-relaxed text-xs max-w-md">
              Falcon Heavy can lift the equivalent of a fully loaded 737 jetliner—complete with passengers, luggage and fuel—to orbit.
            </p>
          </motion.div>

          <div className="rocket-img relative">
            <div className="relative w-full max-w-md mx-auto">
              <ImageHoverCard 
                src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80" 
                alt="Falcon Heavy"
                className="rounded-lg"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-white/30" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION 1 (Falcon Heavy) ===== */}
      <section className="stats-section relative py-32 flex items-center justify-center">
        <div className="text-center space-y-16">
          
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={5} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Launches</p>
          </motion.div>

          <motion.div 
            className="w-px h-16 bg-white/10 mx-auto"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={11} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Landings</p>
          </motion.div>

          <motion.div 
            className="w-px h-16 bg-white/10 mx-auto"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={6} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Reflights</p>
          </motion.div>

        </div>
      </section>

      {/* ===== FALCON HEAVY ILLUSTRATION ===== */}
      <section className="relative py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div 
            className="w-32 h-64 mx-auto mb-8 relative"
            whileHover={{ scale: 1.1, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <svg viewBox="0 0 100 200" className="w-full h-full fill-white/80">
              <path d="M50 0 L60 40 L65 180 L50 190 L35 180 L40 40 Z" />
              <path d="M40 100 L20 140 L25 150 L40 120 Z" />
              <path d="M60 100 L80 140 L75 150 L60 120 Z" />
              <rect x="45" y="50" width="10" height="30" rx="2" fill="#050508" />
            </svg>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
          
          <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed px-8">
            Falcon Heavy is composed of three reusable Falcon 9 nine-engine cores whose 27 Merlin engines together generate more than 5 million pounds of thrust at liftoff, equal to approximately eighteen 747 aircraft. As one of the world's most powerful operational rockets, Falcon Heavy can lift nearly 64 metric tons (141,000 lbs) to orbit.
          </p>
        </motion.div>
      </section>

      {/* ===== FALCON 9 ===== */}
      <section className="rocket-section relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">Workhorse</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">FALCON 9</h2>
            <p className="text-cyan-400 text-sm tracking-widest mb-8">FIRST ORBITAL CLASS ROCKET CAPABLE OF REFLIGHT</p>
            
            <div className="w-16 h-px bg-white/20 mb-8" />
          </motion.div>

          <div className="rocket-img relative">
            <div className="relative w-full max-w-md mx-auto">
              <ImageHoverCard 
                src="/images/falcon9.png"
                alt="Falcon 9 Launch"
                className="rounded-lg"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-white/30" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FALCON 9 DESCRIPTION ===== */}
      <section className="relative py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-24 h-48 relative">
              <svg viewBox="0 0 80 160" className="w-full h-full fill-white/80">
                <path d="M40 0 L48 30 L52 140 L40 150 L28 140 L32 30 Z" />
                <rect x="35" y="40" width="10" height="25" rx="2" fill="#050508" />
              </svg>
            </div>
          </motion.div>
          
          <p className="text-gray-500 text-xs leading-relaxed">
            Falcon 9 is a reusable, two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of people and payloads into Earth orbit and beyond. Falcon 9 is the world's first orbital class reusable rocket. Reusability allows SpaceX to refly the most expensive parts of the rocket, which in turn drives down the cost of space access.
          </p>
        </motion.div>
      </section>

      {/* ===== STATS SECTION 2 (Falcon 9) ===== */}
      <section className="stats-section relative py-32 flex items-center justify-center">
        <div className="text-center space-y-16">
          
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={214} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Launches</p>
          </motion.div>

          <motion.div 
            className="w-px h-16 bg-white/10 mx-auto"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={172} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Landings</p>
          </motion.div>

          <motion.div 
            className="w-px h-16 bg-white/10 mx-auto"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-7xl md:text-9xl font-bold text-white/90">
              <AnimatedNumber value={149} />
            </p>
            <p className="text-xs tracking-[6px] text-gray-500 mt-4 uppercase">Total Reflights</p>
          </motion.div>

        </div>
      </section>

      {/* ===== STARSHIP USES - SATELLITES ===== */}
      <section className="starship-section relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="line-draw w-px h-16 bg-white/30" />
              <p className="text-xs tracking-[6px] text-gray-400 uppercase">Starship Uses</p>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">SATELLITES</h2>
            
            <p className="text-gray-400 leading-relaxed mb-6 text-sm max-w-md">
              Starship is designed to deliver satellites further and at a lower marginal cost per launch than our current Falcon vehicles. With a payload compartment larger than any fairing currently in operation or development, Starship creates possibilities for new missions, including space telescopes even larger than the James Webb.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div 
              className="w-full max-w-lg mx-auto"
              whileHover={{ scale: 1.05 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            >
              <svg viewBox="0 0 400 300" className="w-full">
                <path 
                  d="M200 20 L240 80 L250 200 L230 280 L200 300 L170 280 L150 200 L160 80 Z" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="1"
                />
                <path 
                  d="M160 80 L140 60 L160 100 M240 80 L260 60 L240 100" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="1"
                />
                <rect x="180" y="120" width="40" height="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <line x1="160" y1="135" x2="180" y2="135" stroke="rgba(255,255,255,0.3)" />
                <line x1="220" y1="135" x2="240" y2="135" stroke="rgba(255,255,255,0.3)" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== NASA LUNAR EXPLORATION ===== */}
      <section className="relative min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto group">
              <div className="absolute -inset-4 border border-white/20" />
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-white/50" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-white/50" />
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1541873676-a18131494184?w=600&q=80" 
                  alt="Starship on Moon"
                  className="w-full object-cover"
                  style={{ filter: "brightness(0.6) contrast(1.2)" }}
                />
              </motion.div>
              
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <p className="text-xs tracking-[6px] text-gray-400 mb-4 uppercase">November 15, 2022</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              STARSHIP SELECTED BY NASA<br />TO SUPPORT SUSTAINED<br />LUNAR EXPLORATION
            </h2>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('lunar')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-all inline-flex items-center gap-2 group"
            >
              Read more
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </motion.svg>
            </motion.button>
          </motion.div>
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
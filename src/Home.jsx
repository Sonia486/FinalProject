import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const planets = {
  earth: {
    name: "EARTH",
    subtitle: "PLANET",
    description: "Learn more about this fascinating miracle that we call our home, Planet Earth. Course enrollment starts today. Early Bird tickets typically last a week, don't miss out!",
    leftPlanet: { name: "VENUS", color: "venus" },
    rightPlanet: { name: "MARS", color: "mars" },
    mainColor: "earth",
    image: "/images/earth.png",
    leftImage: "/images/venus.png",
    rightImage: "/images/mars.png",
    accentColor: "bg-cyan-400",
  },
  mercury: {
    name: "MERCURY",
    subtitle: "PLANET",
    description: "Learn more about this smallest planet in our solar system. It's just a little bigger than Earth's moon. It is the closest planet to the sun, but it's actually not the hottest.",
    leftPlanet: { name: "SUN", color: "sun" },
    rightPlanet: { name: "VENUS", color: "venus" },
    mainColor: "mercury",
    image: "/images/mercury.png",
    leftImage: "/images/sun.png",
    rightImage: "/images/venus.png",
    accentColor: "bg-gray-400",
  },
  venus: {
    name: "VENUS",
    subtitle: "PLANET",
    description: "Learn more about this hottest planet. It has a thick atmosphere full of the gas carbon dioxide and clouds made of sulfuric acid. The gas traps heat and keeps Venus toasty warm.",
    leftPlanet: { name: "MERCURY", color: "mercury" },
    rightPlanet: { name: "EARTH", color: "earth" },
    mainColor: "venus",
    image: "/images/venus.png",
    leftImage: "/images/mercury.png",
    rightImage: "/images/earth.png",
    accentColor: "bg-yellow-400",
  }
}

export default function Home() {
  const [currentPlanet, setCurrentPlanet] = useState("earth")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const earthRef = useRef(null)
  const leftPlanetRef = useRef(null)
  const rightPlanetRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const planet = planets[currentPlanet]

  useEffect(() => {
    if (earthRef.current) {
      gsap.to(earthRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }
  }, [currentPlanet])

  useEffect(() => {
    if (leftPlanetRef.current) {
      gsap.to(leftPlanetRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }
    if (rightPlanetRef.current) {
      gsap.to(rightPlanetRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }
  }, [currentPlanet])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".main-planet-container", {
        scale: 2.5,
        y: -100,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      })
      gsap.to(".hero-content", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "50% top",
          scrub: 1,
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handlePlanetChange = (planetKey) => {
    if (isTransitioning || planetKey === currentPlanet) return
    setIsTransitioning(true)
    
    gsap.to(".planet-content", {
      opacity: 0,
      y: -30,
      duration: 0.4,
      onComplete: () => {
        setCurrentPlanet(planetKey)
        gsap.fromTo(".planet-content", 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, onComplete: () => setIsTransitioning(false) }
        )
      }
    })
  }

  const handleSidePlanetClick = (side) => {
    const target = side === "left" ? planet.leftPlanet.name.toLowerCase() : planet.rightPlanet.name.toLowerCase()
    if (planets[target]) {
      handlePlanetChange(target)
    }
  }

  const handleGetStarted = () => {
    navigate("/login")
  }

  const handleNavClick = (item) => {
    setMenuOpen(false)
    if (item === "Trailer") {
      navigate("/trailer")
    } else if (item === "Planets") {
      navigate("/")
    } else if (item === "Space Mysteries") {
      navigate("/space-mysteries")
    } else if (item === "Tickets") {
      navigate("/tickets")
    }
  }

  const handleEnroll = () => {
    navigate("/login")
  }

  const handleLearnMore = () => {
    setShowDetails(!showDetails)
  }

  const earthDetails = [
    {
      title: "Diameter",
      value: "12,742 km",
      desc: "Earth is the fifth largest planet in our solar system."
    },
    {
      title: "Distance from Sun",
      value: "149.6 million km",
      desc: "Also known as 1 Astronomical Unit (AU)."
    },
    {
      title: "Day Length",
      value: "23h 56m 4s",
      desc: "A sidereal day is slightly shorter than a solar day."
    },
    {
      title: "Year Length",
      value: "365.25 days",
      desc: "That's why we have a leap year every 4 years."
    },
    {
      title: "Moons",
      value: "1 (The Moon)",
      desc: "The Moon stabilizes Earth's axial tilt and creates tides."
    },
    {
      title: "Surface Temperature",
      value: "-88°C to 58°C",
      desc: "Average surface temperature is about 15°C."
    }
  ]

  const navItems = [
    { name: "Planets", active: true },
    { name: "Trailer", active: false },
    { name: "Tickets", active: false },
    { name: "Space Mysteries", active: false }
  ]

  return (
    <div ref={containerRef} className="relative min-h-[300vh]" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Stars Background */}
      <div className="fixed inset-0 stars-bg opacity-40 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* ===== NAVBAR ===== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
          <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => navigate("/")}>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Galaxy<span style={{ color: '#4ecdc4' }}> Explorer</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => handleNavClick(item.name)}
                className={`text-sm font-medium tracking-wide cursor-pointer transition-colors hover:text-cyan-400 ${item.active ? "text-white border-b-2 border-cyan-400 pb-1" : "text-gray-300"}`}
              >
                {item.name}
              </motion.li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {/* Profile Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnroll}
              className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            >
              Enroll
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-nav border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.name)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      item.active 
                        ? "bg-white/10 text-white border border-cyan-400/30" 
                        : "text-gray-300 hover:bg-white/5 hover:text-cyan-400"
                    }`}
                  >
                    {item.name}
                  </motion.button>
                ))}
                <div className="pt-2 flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Profile
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMenuOpen(false); handleEnroll(); }}
                    className="flex-1 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Enroll
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section relative h-screen flex flex-col items-center justify-between overflow-hidden pt-24 pb-0">
        
        {/* MAIN CONTENT - TEXT (Top area) */}
        <div className="hero-content relative z-20 text-center px-4 max-w-4xl mx-auto mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlanet}
              className="planet-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p 
                className="text-sm md:text-base tracking-[8px] md:tracking-[12px] mb-4 font-medium"
                style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)' }}
              >
                {planet.subtitle}
              </motion.p>

              <motion.h1 
                className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-bold leading-none mb-6"
                style={{ color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6)' }}
              >
                {planet.name}
              </motion.h1>

              <motion.div className={`w-16 h-1 ${planet.accentColor} mx-auto mb-6 rounded-full`} />

              <motion.p 
                className="text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed px-4"
                style={{ color: '#f0f0f0', textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.8)' }}
              >
                {planet.description}
              </motion.p>

              {/* ===== GET STARTED BUTTON ===== */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="relative inline-block mt-8"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400/40 via-white/30 to-cyan-400/40 rounded-full blur-xl opacity-70 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-500/50 rounded-full blur-md opacity-60" />
                
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 0 60px rgba(78,205,196,0.6), 0 0 120px rgba(78,205,196,0.3), inset 0 0 30px rgba(255,255,255,0.1)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="relative bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-sm tracking-[3px] transition-all duration-300 border-[3px] border-cyan-400"
                  style={{
                    boxShadow: "0 0 40px rgba(78,205,196,0.4), 0 0 80px rgba(78,205,196,0.2), inset 0 0 20px rgba(78,205,196,0.05)"
                  }}
                >
                  GET STARTED
                  <motion.span
                    className="inline-block ml-2 text-base"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDE PLANETS - Left */}
        <motion.div
          className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 z-30 cursor-pointer group"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onClick={() => handleSidePlanetClick("left")}
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-16 md:w-28 h-16 md:h-28 rounded-full overflow-hidden">
              <img
                ref={leftPlanetRef}
                src={planet.leftImage}
                alt={planet.leftPlanet.name}
                className={`w-full h-full object-cover ${planet.leftPlanet.color}-glow transition-all duration-500 group-hover:brightness-125`}
              />
            </div>
            <motion.p 
              className="text-center mt-2 md:mt-3 text-[10px] md:text-sm tracking-[2px] md:tracking-[4px] font-medium"
              style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
            >
              {planet.leftPlanet.name}
            </motion.p>
          </div>
        </motion.div>

        {/* SIDE PLANETS - Right */}
        <motion.div
          className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 z-30 cursor-pointer group"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onClick={() => handleSidePlanetClick("right")}
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-16 md:w-28 h-16 md:h-28 rounded-full overflow-hidden">
              <img
                ref={rightPlanetRef}
                src={planet.rightImage}
                alt={planet.rightPlanet.name}
                className={`w-full h-full object-cover ${planet.rightPlanet.color}-glow transition-all duration-500 group-hover:brightness-125`}
              />
            </div>
            <motion.p 
              className="text-center mt-2 md:mt-3 text-[10px] md:text-sm tracking-[2px] md:tracking-[4px] font-medium"
              style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
            >
              {planet.rightPlanet.name}
            </motion.p>
          </div>
        </motion.div>

        {/* MAIN EARTH - Bottom positioned, large size */}
        <div className="main-planet-container absolute bottom-[-35%] left-1/2 -translate-x-1/2 z-10 w-[500px] md:w-[800px] lg:w-[1000px]">
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full aspect-square">
              <img
                ref={earthRef}
                src={planet.image}
                alt={planet.name}
                className={`w-full h-full object-cover rounded-full ${planet.mainColor}-glow`}
                style={{ display: 'block' }}
              />
            </div>
            
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer z-30"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, #0a0e1a, transparent)' }} />
      </section>

      {/* Spacer for scroll */}
      <div className="h-screen" />
      
      {/* ===== SECOND SECTION - The Blue Planet ===== */}
      <section className="relative z-30 min-h-screen flex items-center pt-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-cyan-400 tracking-[4px] text-sm mb-4">THE BLUE PLANET</p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">EARTH</h2>
              <div className="w-16 h-1 bg-cyan-400 mb-8" />
              <p className="text-gray-300 leading-relaxed mb-8 max-w-lg">
                Earth is the third planet from the Sun. Earth's axis of rotation is tilted with respect to its orbital plane, producing seasons on Earth. The gravitational interaction between Earth and the Moon causes tides, stabilizes Earth's orientation on its axis, and gradually slows its rotation.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLearnMore}
                  className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold btn-glow"
                >
                  {showDetails ? "HIDE DETAILS" : "LEARN MORE"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full max-w-lg mx-auto aspect-square rounded-full overflow-hidden">
                <img
                  src="/images/earth.png"
                  alt="Earth Detail"
                  className="w-full h-full object-cover earth-glow"
                />
              </div>
            </motion.div>
          </div>

          {/* ===== EARTH DETAILS PANEL ===== */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earthDetails.map((detail, index) => (
                    <motion.div
                      key={detail.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-cyan-400/50 group"
                    >
                      <p className="text-cyan-400 text-xs tracking-[3px] uppercase mb-2">{detail.title}</p>
                      <p className="text-white text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{detail.value}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{detail.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== THIRD SECTION - Surface View ===== */}
      <section className="relative z-30 min-h-screen flex items-end pb-20" style={{ backgroundColor: '#0a0e1a' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80"
            alt="Earth Surface"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0e1a, rgba(10,14,26,0.5), transparent)' }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-8"
        >
          <div className="w-16 h-1 bg-cyan-400 mx-auto mb-6" />
          <p className="text-gray-200 leading-relaxed text-lg">
            Our home planet Earth is a rocky, terrestrial planet. It has a solid and active surface with mountains, valleys, canyons, plains and so much more. Earth is special because it is an ocean planet. Water covers 70% of Earth's surface.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
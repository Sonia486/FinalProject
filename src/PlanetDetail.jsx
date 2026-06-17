import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import gsap from "gsap"

const planetData = {
  earth: {
    title: "THE BLUE PLANET",
    name: "EARTH",
    description: "Earth is the third planet from the Sun. Earth's axis of rotation is tilted with respect to its orbital plane, producing seasons on Earth. The gravitational interaction between Earth and the Moon causes tides, stabilizes Earth's orientation on its axis, and gradually slows its rotation.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80",
    accent: "bg-cyan-400",
    glow: "earth-glow",
    surfaceImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    surfaceText: "Our home planet Earth is a rocky, terrestrial planet. It has a solid and active surface with mountains, valleys, canyons, plains and so much more. Earth is special because it is an ocean planet. Water covers 70% of Earth's surface."
  },
  mercury: {
    title: "THE SMALLEST PLANET",
    name: "MERCURY",
    description: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets.",
    image: "https://images.unsplash.com/photo-1614732414444-096e6f3a20fe?w=800&q=80",
    accent: "bg-gray-400",
    glow: "mercury-glow",
    surfaceImage: "https://images.unsplash.com/photo-1614732414444-096e6f3a20fe?w=1600&q=80",
    surfaceText: "Mercury's surface is similar in appearance to that of the Moon, showing extensive mare-like plains and heavy cratering, indicating that it has been geologically inactive for billions of years."
  },
  venus: {
    title: "THE HOTTEST PLANET",
    name: "VENUS",
    description: "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the brightest natural object in Earth's night sky after the Moon, Venus can cast shadows.",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae988dc7?w=800&q=80",
    accent: "bg-yellow-400",
    glow: "venus-glow",
    surfaceImage: "https://images.unsplash.com/photo-1614726365723-49cfae988dc7?w=1600&q=80",
    surfaceText: "Venus has a dense atmosphere consisting mostly of carbon dioxide, with clouds of sulfuric acid. This creates a runaway greenhouse effect that makes Venus the hottest planet in our solar system."
  }
}

export default function PlanetDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const planetRef = useRef(null)
  
  const planet = planetData[name] || planetData.earth

  useEffect(() => {
    if (planetRef.current) {
      gsap.to(planetRef.current, {
        rotate: 360,
        duration: 100,
        repeat: -1,
        ease: "none",
      })
    }
  }, [name])

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#0a0e1a' }}>
      <div className="fixed inset-0 stars-bg opacity-40 pointer-events-none" />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-2xl font-bold tracking-tight hover:text-cyan-400 transition-colors text-white">
            space<span style={{ color: '#4ecdc4' }}>edu</span>
          </button>

          <ul className="hidden md:flex items-center gap-10">
            {["Planets", "Trailer", "Tickets", "Blog"].map((item) => (
              <li key={item} className="text-sm font-medium tracking-wide text-gray-300 cursor-pointer hover:text-cyan-400 transition-colors">
                {item}
              </li>
            ))}
          </ul>

          <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold">
            Enroll
          </button>
        </div>
      </motion.nav>

      <section className="min-h-screen flex items-center pt-20 relative">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <p className="text-cyan-400 tracking-[6px] text-sm mb-4 font-medium">
                {planet.title}
              </p>
              <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-none text-white">
                {planet.name}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`w-20 h-1 ${planet.accent} mb-8 origin-left`}
              />
              <p className="text-gray-300 leading-relaxed mb-10 max-w-lg text-base">
                {planet.description}
              </p>
              
              <div className="flex gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-900 px-10 py-4 rounded-full font-semibold text-sm btn-glow"
                >
                  LEARN MORE
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(78, 205, 196, 0.5)" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-400/50"
                  style={{ backgroundColor: 'rgba(78, 205, 196, 0.2)' }}
                >
                  <svg className="w-5 h-5 text-cyan-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative flex justify-center"
            >
              <div className="w-[400px] md:w-[500px] lg:w-[600px] aspect-square rounded-full overflow-hidden">
                <img
                  ref={planetRef}
                  src={planet.image}
                  alt={planet.name}
                  className={`w-full h-full object-cover ${planet.glow}`}
                />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-[120%] border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-end pb-20 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src={planet.surfaceImage}
            alt={`${planet.name} Surface`}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0e1a, rgba(10,14,26,0.6), transparent)' }} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center px-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`w-20 h-1 ${planet.accent} mx-auto mb-8`}
          />
          <p className="text-gray-200 leading-relaxed text-lg md:text-xl">
            {planet.surfaceText}
          </p>
        </motion.div>
      </section>
    </div>
  )
}
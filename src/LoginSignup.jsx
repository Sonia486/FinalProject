import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

// ===== API URL =====
const API_URL = "https://finalproject-production-76be.up.railway.app";

// ===== FLOATING PARTICLES BACKGROUND =====
function SpaceParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.random() > 0.5 ? '78, 205, 196' : '255, 255, 255'}, ${Math.random() * 0.6 + 0.2})`,
            boxShadow: `0 0 ${Math.random() * 15 + 5}px rgba(${Math.random() > 0.5 ? '78, 205, 196' : '255, 255, 255'}, 0.4)`
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

// ===== ROCKET ANIMATION =====
function RocketAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg width="120" height="200" viewBox="0 0 120 200" fill="none" className="drop-shadow-[0_0_30px_rgba(78,205,196,0.5)]">
          <path d="M60 10 L75 60 L80 160 L60 175 L40 160 L45 60 Z" fill="url(#rocketGradient)" stroke="rgba(78,205,196,0.5)" strokeWidth="1"/>
          <path d="M60 10 L75 60 L60 50 L45 60 Z" fill="url(#noseGradient)"/>
          <circle cx="60" cy="80" r="12" fill="#0a0e1a" stroke="rgba(78,205,196,0.6)" strokeWidth="2"/>
          <circle cx="60" cy="80" r="8" fill="rgba(78,205,196,0.3)"/>
          <path d="M45 120 L20 160 L30 165 L45 140 Z" fill="url(#finGradient)" stroke="rgba(78,205,196,0.3)" strokeWidth="1"/>
          <path d="M75 120 L100 160 L90 165 L75 140 Z" fill="url(#finGradient)" stroke="rgba(78,205,196,0.3)" strokeWidth="1"/>
          <rect x="48" y="165" width="24" height="10" rx="2" fill="#1a1a2e" stroke="rgba(78,205,196,0.4)" strokeWidth="1"/>
          <defs>
            <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a2e"/>
              <stop offset="50%" stopColor="#16213e"/>
              <stop offset="100%" stopColor="#1a1a2e"/>
            </linearGradient>
            <linearGradient id="noseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ecdc4"/>
              <stop offset="100%" stopColor="#1a1a2e"/>
            </linearGradient>
            <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16213e"/>
              <stop offset="100%" stopColor="#0a0e1a"/>
            </linearGradient>
          </defs>
        </svg>

        <motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2" animate={{ scaleY: [1, 1.3, 0.8, 1.2, 1], opacity: [0.8, 1, 0.6, 1, 0.8] }} transition={{ duration: 0.5, repeat: Infinity }}>
          <div className="w-6 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-8 bg-gradient-to-t from-cyan-400 via-white to-transparent rounded-full" />
        </motion.div>

        <motion.div className="absolute inset-0 -m-20" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-110" />
        </motion.div>
        <motion.div className="absolute inset-0 -m-32" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400/50 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(78,205,196,0.8)]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ===== GLITCH TEXT =====
function GlitchText({ text }) {
  const [displayed, setDisplayed] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

  useEffect(() => {
    let iteration = 0
    const finalText = text
    const interval = setInterval(() => {
      setDisplayed(finalText.split("").map((char, index) => {
        if (char === " ") return char
        if (index < iteration / 3) return finalText[index]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join(""))
      if (iteration >= finalText.length * 3) {
        setIsComplete(true)
        setDisplayed(finalText)
        clearInterval(interval)
      }
      iteration += 0.5
    }, 40)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="relative">
      {displayed}
      {!isComplete && <span className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 animate-pulse align-middle" />}
    </span>
  )
}

// ===== INPUT FIELD =====
function AnimatedInput({ type, placeholder, icon, value, onChange, name, error }) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <motion.div className="relative" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <div className={`relative flex items-center bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 ${
        error ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : isFocused ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(78,205,196,0.15)]' : 'border-white/10'
      }`}>
        {icon && <div className="pl-4 text-gray-400">{icon}</div>}
        <input
          type={inputType} name={name} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-white px-4 py-3.5 text-sm placeholder-gray-500 outline-none"
        />
        {type === "password" && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-gray-400 hover:text-cyan-400 transition-colors">
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        )}
        {isFocused && !error && <motion.div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.3 }} />}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: "", password: "", name: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Check if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      navigate("/profile")
    }
  }, [navigate])

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name)

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter"
    if (!/[a-z]/.test(password)) return "Password must contain at least 1 lowercase letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least 1 number"
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<<>\/?]/.test(password)) return "Password must contain at least 1 special character"
    return null
  }

  const validateForm = () => {
    const newErrors = {}
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      else if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
      else if (!validateName(formData.name)) newErrors.name = "Name can only contain letters (no numbers allowed)"
    }
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format"
    
    if (!isLogin) {
      const passwordError = validatePassword(formData.password)
      if (!formData.password) newErrors.password = "Password is required"
      else if (passwordError) newErrors.password = passwordError
    } else {
      if (!formData.password) newErrors.password = "Password is required"
    }

    if (!isLogin) {
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  // ====== EMAIL NOTIFICATION FUNCTION ======
  const sendWelcomeEmail = async (userEmail, userName, type) => {
    try {
      const subject = type === "login" 
        ? "Welcome Back to Galaxy Explorer! 🚀"
        : "Welcome to Galaxy Explorer! 🚀";
      
      const message = type === "login"
        ? `${userName}, you have successfully logged in to Galaxy Explorer!`
        : `${userName}, you are successfully registered to Galaxy Explorer!`;

      const response = await fetch(`${API_URL}/send-notification`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: userEmail, 
          name: userName,
          subject: subject,
          message: message,
          type: type
        })
      });

      if (!response.ok) {
        console.log("Email notification failed, but login/signup successful");
      } else {
        console.log("✅ Email notification sent to:", userEmail);
      }
    } catch (error) {
      console.error("Email notification error:", error);
      // Don't block login/signup if email fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    
    setTimeout(async () => {
      if (isLogin) {
        // LOGIN: Check if user exists
        const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
        const user = users.find(u => u.email === formData.email)
        
        if (!user) {
          setErrors({ email: "Email not registered" })
          setIsSubmitting(false)
          return
        }
        if (user.password !== formData.password) {
          setErrors({ password: "Wrong password" })
          setIsSubmitting(false)
          return
        }
        
        // Login successful - send email notification
        await sendWelcomeEmail(user.email, user.name, "login");
        
        // Login successful
        localStorage.setItem("currentUser", JSON.stringify(user))
      } else {
        // SIGNUP: Check if email already exists
        const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
        if (users.find(u => u.email === formData.email)) {
          setErrors({ email: "Email already registered" })
          setIsSubmitting(false)
          return
        }
        
        // Create new user
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          username: formData.name.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 1000),
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          emailVerified: true,
          twoFactorEnabled: false,
          lastLogin: new Date().toLocaleString(),
          favoritePlanets: ["Earth"],
          savedArticles: 0,
          quizScore: 0,
          bio: "Space explorer on a cosmic journey.",
          profileImage: null
        }
        
        users.push(newUser)
        localStorage.setItem("galaxyUsers", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(newUser))
        
        // Signup successful - send email notification
        await sendWelcomeEmail(newUser.email, newUser.name, "signup");
      }
      
      setIsSubmitting(false)
      navigate("/profile")
    }, 1500)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", name: "", confirmPassword: "" })
    setErrors({})
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden flex items-center justify-center">
      <SpaceParticles />
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 min-h-screen">
        <motion.div className="hidden lg:flex flex-1 items-center justify-center" initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
          <div className="text-center">
            <RocketAnimation />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8">
              <h2 className="text-3xl font-bold mb-2"><GlitchText text="GALAXY EXPLORER" /></h2>
              <p className="text-gray-400 text-sm tracking-widest">BEGIN YOUR JOURNEY</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-30" />
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400/30 rounded-br-2xl" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.h1 className="text-3xl font-bold mb-2" key={isLogin ? "login" : "signup"} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                  {isLogin ? "WELCOME BACK" : "JOIN THE MISSION"}
                </motion.h1>
                <motion.p className="text-gray-400 text-sm" key={isLogin ? "login-sub" : "signup-sub"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {isLogin ? "Enter your credentials to access your account" : "Create your account to start exploring"}
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <AnimatedInput type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} error={errors.name}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatedInput type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />

                <AnimatedInput type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <AnimatedInput type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLogin && (
                  <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500 group-hover:border-cyan-400'}`}>
                          {rememberMe && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">Remember Me</span>
                    </label>
                    <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-cyan-400 hover:text-cyan-300">Forgot Password?</button>
                  </motion.div>
                )}

                <motion.button type="submit" disabled={isSubmitting}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm tracking-wider transition-all group disabled:opacity-70"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                    ) : (
                      <>
                        {isLogin ? "LOGIN" : "SIGNUP"}
                        <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-4 bg-[#0a0e1a] text-gray-500">OR</span></div>
              </div>

              <div className="flex gap-3 justify-center">
                {[{ icon: "G" }, { icon: "GH" }, { icon: "X" }].map((social, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-cyan-400 transition-all">
                    {social.icon}
                  </motion.button>
                ))}
              </div>

              <motion.div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={switchMode} className="text-cyan-400 hover:text-cyan-300 font-semibold relative group">
                    {isLogin ? "Sign Up" : "Log In"}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all" />
                  </button>
                </p>
              </motion.div>
            </div>
          </div>

          <motion.button onClick={() => navigate("/")} className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-white text-sm mx-auto" whileHover={{ x: -5 }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
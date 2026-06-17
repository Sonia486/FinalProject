import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

// ===== API URL =====
const API_URL = "http://localhost:5000";

function SpaceParticles() {
  return (
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
            background: `rgba(${Math.random() > 0.5 ? '78, 205, 196' : '255, 255, 255'}, ${Math.random() * 0.5 + 0.2})`,
            boxShadow: `0 0 ${Math.random() * 10 + 3}px rgba(78, 205, 196, 0.3)`
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // ====== SEND OTP ======
  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setErrors({ email: "Email is required" })
      return
    }
    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email format" })
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      console.log("🚀 Sending request to:", `${API_URL}/send-otp`);
      
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, type: "forgot" })
      })
      
      console.log("📡 Response status:", response.status);
      
      const data = await response.json()
      console.log("📡 Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP")
      }
      
      setStep(2)
      setTimer(60)
      setCanResend(false)
    } catch (error) {
      console.error("❌ Error:", error);
      setErrors({ email: error.message || "Failed to connect to server. Check if backend is running!" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ====== VERIFY OTP ======
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter complete 6-digit OTP" })
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, otp: otpValue })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP")
      }
      
      setStep(3)
    } catch (error) {
      setErrors({ otp: error.message || "Failed to verify" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ====== RESET PASSWORD ======
  const handleResetPassword = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!newPassword) newErrors.newPassword = "Password is required"
    else if (newPassword.length < 8) newErrors.newPassword = "Minimum 8 characters"
    
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, newPassword })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }
      
      setStep(4)
    } catch (error) {
      setErrors({ general: error.message || "Failed to reset" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ====== RESEND OTP ======
  const handleResendOTP = async () => {
    if (!canResend) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, type: "forgot" })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend")
      }
      
      setOtp(["", "", "", "", "", ""])
      setTimer(60)
      setCanResend(false)
    } catch (error) {
      setErrors({ otp: error.message || "Failed to resend" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden flex items-center justify-center">
      <SpaceParticles />
      
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-3"
              >
                {step === 1 && "🔐"}
                {step === 2 && "📧"}
                {step === 3 && "🔑"}
                {step === 4 && "✅"}
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Enter OTP"}
                {step === 3 && "Reset Password"}
                {step === 4 && "Success!"}
              </h1>
              <p className="text-gray-400 text-sm">
                {step === 1 && "Enter your email to receive OTP"}
                {step === 2 && `We sent a code to ${email}`}
                {step === 3 && "Create a new password"}
                {step === 4 && "Your password has been reset"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}) }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                        Sending...
                      </span>
                    ) : "Send OTP"}
                  </motion.button>
                </motion.form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-4"
                >
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold outline-none focus:border-cyan-400 transition-colors"
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-400 text-xs text-center">{errors.otp}</p>}
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                        Verifying...
                      </span>
                    ) : "Verify OTP"}
                  </motion.button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || isSubmitting}
                      className={`text-sm ${canResend ? 'text-cyan-400 hover:text-cyan-300' : 'text-gray-500 cursor-not-allowed'}`}
                    >
                      {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword}
                  className="space-y-4"
                >
                  {errors.general && <p className="text-red-400 text-xs text-center">{errors.general}</p>}
                  
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors({}) }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-500 ${errors.newPassword ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}) }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                        Resetting...
                      </span>
                    ) : "Reset Password"}
                  </motion.button>
                </motion.form>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-2"
                  >
                    🎉
                  </motion.div>
                  <p className="text-gray-300">Your password has been successfully reset!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Go to Login
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {step !== 4 && (
              <motion.button
                onClick={() => navigate("/login")}
                className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mx-auto w-full"
                whileHover={{ x: -5 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
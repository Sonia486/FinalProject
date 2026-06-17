import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

function SpaceParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(40)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full" style={{
          width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          background: `rgba(${Math.random() > 0.5 ? '78, 205, 196' : '255, 255, 255'}, ${Math.random() * 0.5 + 0.2})`,
          boxShadow: `0 0 ${Math.random() * 10 + 3}px rgba(78, 205, 196, 0.3)`
        }}
          animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -40, 0], x: [0, Math.random() * 20 - 10, 0] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}
    </div>
  )
}

function GlitchText({ text }) {
  const [displayed, setDisplayed] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayed(text.split("").map((char, index) => {
        if (char === " ") return char
        if (index < iteration / 3) return text[index]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join(""))
      if (iteration >= text.length * 3) { setDisplayed(text); clearInterval(interval) }
      iteration += 0.5
    }, 40)
    return () => clearInterval(interval)
  }, [text])
  return <span>{displayed}<span className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 animate-pulse align-middle" /></span>
}

function StatCard({ label, value, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }} className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center group cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs text-gray-400 tracking-wider uppercase">{label}</p>
      </div>
    </motion.div>
  )
}

export default function UserProfile() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [bookings, setBookings] = useState([])

  // Load user from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      navigate("/login")
      return
    }
    const parsedUser = JSON.parse(currentUser)
    setUser(parsedUser)
    setEditForm({ ...parsedUser })
    setProfileImage(parsedUser.profileImage)
    
    // Load bookings
    const allBookings = JSON.parse(localStorage.getItem("galaxyBookings") || "[]")
    const userBookings = allBookings.filter(b => b.email === parsedUser.email)
    setBookings(userBookings)
  }, [navigate])

  if (!user) return null

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        const updatedUser = { ...user, profileImage: reader.result }
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
        const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
        localStorage.setItem("galaxyUsers", JSON.stringify(updatedUsers))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...editForm, profileImage }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
    localStorage.setItem("galaxyUsers", JSON.stringify(updatedUsers))
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    navigate("/login")
  }

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
    const filteredUsers = users.filter(u => u.id !== user.id)
    localStorage.setItem("galaxyUsers", JSON.stringify(filteredUsers))
    localStorage.removeItem("currentUser")
    navigate("/login")
  }

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter"
    if (!/[a-z]/.test(password)) return "Password must contain at least 1 lowercase letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least 1 number"
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<<>\/?]/.test(password)) return "Password must contain at least 1 special character"
    return null
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })
    if (passwordErrors[name]) setPasswordErrors({ ...passwordErrors, [name]: "" })
  }

  const handleUpdatePassword = () => {
    const newErrors = {}
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required"
    else if (passwordForm.currentPassword !== user.password) newErrors.currentPassword = "Wrong current password"
    
    const passwordError = validatePassword(passwordForm.newPassword)
    if (!passwordForm.newPassword) newErrors.newPassword = "New password is required"
    else if (passwordError) newErrors.newPassword = passwordError
    
    if (!passwordForm.confirmNewPassword) newErrors.confirmNewPassword = "Please confirm your new password"
    else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors)
      return
    }

    const updatedUser = { ...user, password: passwordForm.newPassword }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    const users = JSON.parse(localStorage.getItem("galaxyUsers") || "[]")
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
    localStorage.setItem("galaxyUsers", JSON.stringify(updatedUsers))
    
    setShowChangePassword(false)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
    setPasswordErrors({})
  }

  const planetOptions = ["Earth", "Mars", "Venus", "Jupiter", "Saturn", "Mercury", "Uranus", "Neptune"]

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmed": return "text-green-400 bg-green-500/10 border-green-500/20"
      case "Completed": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
      default: return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <SpaceParticles />
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 12, repeat: Infinity }} />
      </div>

      {/* NAVBAR - Same as Trailer page */}
      <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => navigate("/")}>
            <span className="text-2xl font-bold tracking-tight text-white">
              Galaxy<span style={{ color: '#4ecdc4' }}> Explorer</span>
            </span>
          </motion.div>
          <ul className="hidden md:flex items-center gap-10">
            {[
              { name: "Planets", path: "/" },
              { name: "Trailer", path: "/trailer" },
              { name: "Tickets", path: "/tickets" },
              { name: "Space Mysteries", path: "/space-mysteries" },
            ].map((item, i) => (
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
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-500/30 transition-colors">
            Logout
          </motion.button>
        </div>
      </motion.nav>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2"><GlitchText text="COMMAND CENTER" /></h1>
            <p className="text-sm tracking-widest text-gray-400">USER PROFILE</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
              <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden bg-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                <div className="relative z-10 text-center">
                  <div className="relative inline-block mb-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-400/30 mx-auto">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10">
                          <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                      )}
                    </motion.div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </motion.button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>

                  <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                  <p className="text-sm mb-2 text-gray-400">@{user.username}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-green-400 text-sm">Email Verified</span>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full inline-block mb-4 bg-white/10 text-gray-300">
                    Member Since: {user.joinDate}
                  </div>
                  <p className="text-sm italic mb-6 text-gray-400">"{user.bio}"</p>

                  <div className="space-y-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsEditing(true)}
                      className="w-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Edit Profile
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowChangePassword(true)}
                      className="w-full bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Change Password
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(true)}
                      className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMNS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Planets" value={user.favoritePlanets?.length || 0} delay={0.3} />
                <StatCard label="Bookings" value={bookings.length} delay={0.4} />
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 bg-white/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Account Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[{ label: "Full Name", value: user.name }, { label: "Username", value: user.username }, { label: "Email", value: user.email }, { label: "Last Login", value: user.lastLogin }].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs uppercase tracking-wider mb-1 text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Email Verified</span>
                  </div>
                </div>
                <div className={`mt-2 p-3 rounded-lg border ${user.twoFactorEnabled ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={user.twoFactorEnabled ? "M5 13l4 4L19 7" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} /></svg>
                    <span>Two-Factor Authentication {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </motion.div>

              {/* MY BOOKINGS SECTION */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 bg-white/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  My Bookings
                </h3>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm mb-3">No bookings yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/tickets")}
                      className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                    >
                      Book your first journey →
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking, i) => (
                      <motion.div
                        key={booking.ticketId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{booking.destination}</p>
                              <p className="text-xs text-gray-500">{booking.ticketId}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-11">
                          <span>{booking.travelDate}</span>
                          <span>•</span>
                          <span>{booking.travelClass}</span>
                          <span>•</span>
                          <span>{booking.passengers} Passenger{booking.passengers > 1 ? 's' : ''}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-6 bg-white/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Favorite Planets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(user.favoritePlanets || []).map((planet, i) => (
                    <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.1 }} className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm cursor-pointer hover:bg-cyan-500/30 transition-colors">
                      {planet}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Back to Home */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back to Home
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full max-h-[85vh] overflow-y-auto custom-scrollbar border border-white/10 rounded-2xl p-6 shadow-2xl bg-[#0a0e1a]">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit Profile
                </h2>
                <div className="space-y-4">
                  {['name', 'username', 'bio'].map((field) => (
                    <div key={field}>
                      <label className="text-xs uppercase tracking-wider mb-1 block text-gray-400">{field === 'bio' ? 'Bio' : field}</label>
                      {field === 'bio' ? (
                        <textarea value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border outline-none focus:border-cyan-400 transition-colors resize-none bg-white/5 border-white/10 text-white" />
                      ) : (
                        <input type="text" value={editForm[field] || ''} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border outline-none focus:border-cyan-400 transition-colors bg-white/5 border-white/10 text-white" />
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="text-xs uppercase tracking-wider mb-1 block text-gray-400">Favorite Planets</label>
                    <div className="flex flex-wrap gap-2">
                      {planetOptions.map((planet) => (
                        <button key={planet} onClick={() => {
                          const current = editForm.favoritePlanets || []
                          setEditForm({ ...editForm, favoritePlanets: current.includes(planet) ? current.filter(p => p !== planet) : [...current, planet] })
                        }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${(editForm.favoritePlanets || []).includes(planet) ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                          {planet}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSaveProfile}
                    className="flex-1 bg-cyan-500 text-white py-2.5 rounded-xl font-medium hover:bg-cyan-600 transition-colors">Save Changes</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl font-medium border border-white/10 hover:bg-white/5">Cancel</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowChangePassword(false)}>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full border border-white/10 rounded-2xl p-6 shadow-2xl bg-[#0a0e1a]">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Change Password
                </h2>
                <div className="space-y-4">
                  {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
                    <div key={field}>
                      <label className="text-xs uppercase tracking-wider mb-1 block text-gray-400">
                        {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <input type="password" name={field} value={passwordForm[field]} onChange={handlePasswordChange}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:border-cyan-400 transition-colors bg-white/5 border-white/10 text-white ${passwordErrors[field] ? 'border-red-500' : ''}`} />
                      {passwordErrors[field] && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {passwordErrors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdatePassword}
                    className="flex-1 bg-cyan-500 text-white py-2.5 rounded-xl font-medium hover:bg-cyan-600 transition-colors">Update Password</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowChangePassword(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); setPasswordErrors({}) }}
                    className="flex-1 py-2.5 rounded-xl font-medium border border-white/10 hover:bg-white/5">Cancel</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT CONFIRMATION */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="relative max-w-sm w-full bg-red-950/90 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-3 text-red-400">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-red-400 mb-2">Delete Account?</h2>
                <p className="text-sm text-gray-300 mb-6">This action cannot be undone. All your data will be permanently removed. You will need to create a new account.</p>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors">Yes, Delete</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-white/10 text-white py-2.5 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors">Cancel</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
import { useState } from 'react'
import { Brain, Lock, Mail, User, Check, AlertCircle } from 'lucide-react'

// Simulated database initialization helper
const initUserDatabase = () => {
  const users = localStorage.getItem('agrosense_users')
  if (!users) {
    const defaultUsers = [
      {
        username: 'AgroAdmin',
        email: 'admin@agrosense.ai',
        password: 'password123',
        createdAt: new Date().toISOString(),
      }
    ]
    localStorage.setItem('agrosense_users', JSON.stringify(defaultUsers))
  }
}

export default function Login({ onLoginSuccess }) {
  initUserDatabase()
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAuth = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const users = JSON.parse(localStorage.getItem('agrosense_users') || '[]')

    if (isSignUp) {
      // Sign Up validation
      if (!username || !email || !password || !confirmPassword) {
        setError('All fields are required.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }

      // Check if user already exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
      if (userExists) {
        setError('An account with this email already exists.')
        return
      }

      // Save user
      const newUser = {
        username,
        email: email.toLowerCase(),
        password,
        createdAt: new Date().toISOString()
      }
      users.push(newUser)
      localStorage.setItem('agrosense_users', JSON.stringify(users))
      setSuccess('Account created successfully! You can now log in.')
      setIsSignUp(false)
      // Reset signup specific fields
      setPassword('')
      setConfirmPassword('')
    } else {
      // Login validation
      if (!email || !password) {
        setError('Please enter your email and password.')
        return
      }

      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (user) {
        localStorage.setItem('agrosense_current_user', JSON.stringify(user))
        onLoginSuccess(user)
      } else {
        setError('Invalid email or password.')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030712] overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-neon-sar/10 rounded-full blur-3xl" />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="w-full max-w-md p-8 glass border border-white/10 rounded-2xl shadow-glass-lg relative z-10 animate-fade-in mx-4">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-neon-green/10 border border-neon-green/30 shadow-neon">
            <Brain className="text-neon-green" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AgroSense AI</h1>
          <p className="text-xs text-gray-400 mt-1">Satellite Precision Agriculture Platform</p>
        </div>

        {/* Success/Error Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2 text-xs text-green-400">
            <Check size={14} className="flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AgroFarmer"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:border-neon-green focus:ring-1 focus:ring-neon-green text-white placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agrosense.ai"
                className="w-full pl-9 pr-3 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:border-neon-green focus:ring-1 focus:ring-neon-green text-white placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={14} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:border-neon-green focus:ring-1 focus:ring-neon-green text-white placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:border-neon-green focus:ring-1 focus:ring-neon-green text-white placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-neon-green hover:bg-[#00e676] shadow-neon transition-all duration-200 mt-2 flex items-center justify-center gap-1.5"
          >
            {isSignUp ? 'Create Account' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-gray-400">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
            }}
            className="text-neon-green font-bold hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>

        {/* Demo Credentials Helper */}
        {!isSignUp && (
          <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400">
            <span className="font-semibold text-white block mb-1">💡 Demo Admin Account:</span>
            <div>Email: <span className="font-mono text-neon-green select-all">admin@agrosense.ai</span></div>
            <div>Password: <span className="font-mono text-neon-green select-all">password123</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

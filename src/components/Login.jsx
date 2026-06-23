import { useState } from 'react'
import { Brain, Lock, Mail, User, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Sign Up validation
        if (!username || !email || !password || !confirmPassword) {
          setError('All fields are required.')
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.')
          setLoading(false)
          return
        }

        // Supabase sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: password,
          options: {
            data: {
              username: username
            }
          }
        })

        if (signUpError) {
          setError(signUpError.message)
          setLoading(false)
          return
        }

        setSuccess('Registration successful! If email verification is enabled, please verify your email. Otherwise, you can log in now.')
        setIsSignUp(false)
        setPassword('')
        setConfirmPassword('')
      } else {
        // Login validation
        if (!email || !password) {
          setError('Please enter your email and password.')
          setLoading(false)
          return
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password: password
        })

        if (signInError) {
          setError(signInError.message)
          setLoading(false)
          return
        }

        if (data?.user) {
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || data.user.email.split('@')[0],
          }
          onLoginSuccess(userObj)
        }
      }
    } catch (err) {
      setError('Could not connect to Supabase. Check your API credentials.')
    } finally {
      setLoading(false)
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
                  required
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
                required
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
                required
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
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:border-neon-green focus:ring-1 focus:ring-neon-green text-white placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-neon-green hover:bg-[#00e676] shadow-neon transition-all duration-200 mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In to Dashboard'}
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
      </div>
    </div>
  )
}

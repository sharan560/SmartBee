import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import honey from '../assets/honey.jpg'

const mockSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes('@')) {
        resolve({ token: 'fake-token', user: { email } })
      } else {
        if (!email.includes('@')) {
          reject(new Error('Invalid email format'))
        } 
      }
    }, 700)
  })
}

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Please enter your email')
    if (!password) return setError('Please enter your password')

    setLoading(true)
    try {
      const res = await mockSignIn(email, password)
      localStorage.setItem('sb_token', res.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Motion variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="flex flex-col justify-center items-center max-w-4xl mx-auto px-6 py-12 mt-40">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 w-full"
        >
          <div className="flex-shrink-0 text-center md:text-left">
            <img src={honey} alt="Sharan" className="w-72 h-72 rounded-xl shadow-md" />
          </div>

          <div className="w-full flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-2 text-center text-[#33691e]">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-[#f0f4c3]">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nsharan006@gmail.com"
                  className="mt-1 block w-full max-w-lg rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/90">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="mt-1 block w-full max-w-lg rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                  required
                />
              </label>

              {error && <div className="text-red-700 text-center">{error}</div>}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-200 text-green-800 font-semibold px-5 py-2 rounded shadow hover:scale-105 hover:shadow-lg transition ease-in-out duration-200 disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <a
                  href="#"
                  className="text-sm text-white/90 hover:underline text-center md:text-left"
                >
                  Forgot password?
                </a>
              </div>
              <p className="text-white text-center">
                Don't Have an Account?{' '}
                <a href="/signup" className="underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Login

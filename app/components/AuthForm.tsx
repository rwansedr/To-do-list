import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Insert user into your 'users' table
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: data.user.id, email: data.user.email }])

        if (insertError) {
          setError(insertError.message)
          return
        }

        setMessage('Success! Please check your email to verify your account.')
        console.log('User signed up and added to users table:', data.user)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage(`Welcome back, ${data.user?.email}!`)
        console.log('Logged in:', data.user)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {isSignUp ? 'Create Account' : 'Log In'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsSignUp(!isSignUp)
          setError('')
          setMessage('')
        }}
        className="text-blue-500 text-sm"
      >
        {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
    </form>
  )
}

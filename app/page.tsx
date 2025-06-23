'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AuthForm from './components/AuthForm'
import TodoList from './components/TodoList'
import SignOutButton from './components/SignOutButton'

export default function HomePage() {
  const [session, setSession] = useState<any>(undefined)

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Optional loading state while session is being checked
  if (session === undefined) {
    return <div className="text-center mt-20">Loading...</div>
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {!session ? (
        <AuthForm />
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <TodoList session={session} />
          <SignOutButton />
        </div>
      )}
    </main>
  )
}

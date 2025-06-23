'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AuthForm from './components/AuthForm'
import TodoList from './components/TodoList'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!session ? <AuthForm /> : <TodoList session={session} />}
    </main>
  )
}

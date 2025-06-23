'use client'

import { supabase } from '@/lib/supabaseClient'

export default function SignOutButton() {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload() // Refresh to reflect auth state
  }

  return (
    <button
      onClick={handleSignOut}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  )
}

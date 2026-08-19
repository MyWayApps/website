"use client"

import { useEffect, useState } from "react"
import { findOrCreateUser, testConnection } from "@/lib/database-supabase"
import type { User } from "@/lib/database-supabase"

/** Initializes the current MyWayApps user + Supabase connection status — the same boilerplate most game pages repeat inline. */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const connected = await testConnection()
      if (cancelled) return
      setIsConnected(connected)

      const stored = localStorage.getItem("mywayapps_current_user")
      const parsedUser = stored ? JSON.parse(stored) : null

      if (connected) {
        const currentUser = await findOrCreateUser(
          parsedUser ?? { name: "Demo User", email: "demo@mywayapps.com", age: 8, grade: "3rd Grade" },
        )
        if (!cancelled) setUser(currentUser)
      } else if (parsedUser && !cancelled) {
        setUser(parsedUser)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  return { user, isConnected }
}

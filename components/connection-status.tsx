"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { testConnection } from "@/lib/database-safe"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      console.log("Testing database connection...")
      const connected = await testConnection()
      console.log("Connection test result:", connected)
      setIsConnected(connected)
    } catch (error) {
      console.error("Connection test error:", error)
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (isConnected === null) {
    return null
  }

  return (
    <Card className={`mb-4 ${isConnected ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${isConnected ? "text-green-800" : "text-red-800"}`}>
              {isConnected ? "Database Connected" : "Database Connection Failed - Using Offline Mode"}
            </span>
          </div>
          <Button
            onClick={checkConnection}
            disabled={isChecking}
            size="sm"
            variant="outline"
            className={isConnected ? "border-green-300 text-green-700" : "border-red-300 text-red-700"}
          >
            {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Test
          </Button>
        </div>
        {!isConnected && (
          <div className="mt-2 text-sm text-red-600">
            <p>The app is running in offline mode with demo data. To enable database features:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Set NEXT_PUBLIC_SUPABASE_URL in .env.local</li>
              <li>Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local</li>
              <li>Run the database setup scripts in Supabase</li>
              <li>Restart the development server (npm run dev)</li>
            </ul>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
              <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}</div>
              <div>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

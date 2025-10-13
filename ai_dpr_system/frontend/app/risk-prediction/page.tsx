'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RiskPredictionRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the dashboard risk prediction page
    router.push('/dashboard/risk-prediction')
  }, [router])
  
  // Return a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-500">Please wait while we redirect you to the Risk Prediction page.</p>
      </div>
    </div>
  )
}

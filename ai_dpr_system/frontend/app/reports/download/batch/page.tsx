'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Download, FileArchive, Loader2 } from 'lucide-react'

export default function BatchDownloadPage() {
  const searchParams = useSearchParams()
  const isBatch = searchParams.get('batch') === 'true'
  const reportIds = searchParams.get('ids')?.split(',') || []
  const singleId = searchParams.get('id')
  
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Simulating download progress
    let interval: NodeJS.Timeout;
    
    const startDownload = () => {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 10
          if (next >= 100) {
            clearInterval(interval)
            setIsComplete(true)
            return 100
          }
          return next
        })
      }, 200)
    }
    
    // Slight delay to show the initial loading state
    const timeout = setTimeout(() => {
      startDownload()
    }, 500)
    
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [])
  
  // In a real app, we would fetch report details here
  const fileName = isBatch 
    ? `reports_batch_${new Date().toISOString().split('T')[0]}.zip` 
    : `report_${singleId}.pdf`
  
  const fileCount = isBatch ? reportIds.length : 1
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center">
      {!isComplete ? (
        <>
          <div className="w-16 h-16 mb-6 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-primary animate-spin"></div>
          <h1 className="text-2xl font-bold mb-2">Preparing your download</h1>
          <p className="text-muted-foreground mb-6">
            {isBatch 
              ? `Packaging ${fileCount} files into a ZIP archive...` 
              : 'Preparing your file for download...'}
          </p>
          
          <div className="w-full mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-right text-muted-foreground mt-1">{Math.round(progress)}%</p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            This may take a moment. Please don't close this window.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Download Ready!</h1>
          
          {isBatch ? (
            <p className="text-muted-foreground mb-6">
              Your ZIP file containing {fileCount} reports is ready to download.
            </p>
          ) : (
            <p className="text-muted-foreground mb-6">
              Your report is ready to download.
            </p>
          )}
          
          <div className="border border-border rounded-lg p-4 mb-6 w-full">
            <div className="flex items-center">
              <div className="bg-muted rounded-lg p-2 mr-4">
                <FileArchive className="h-8 w-8 text-primary" />
              </div>
              <div className="text-left flex-1 truncate">
                <p className="font-medium truncate">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {isBatch ? `${fileCount} files` : 'PDF Document'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 w-full">
            <Button className="w-full" asChild>
              <a href="#" onClick={(e) => {
                e.preventDefault()
                // In a real app, this would be the actual download URL
                // For now, just show a message
                alert(`Downloading ${fileName}`)
              }}>
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </a>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/reports">
                Return to Reports
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
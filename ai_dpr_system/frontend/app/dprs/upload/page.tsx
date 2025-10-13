'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, FileText, FileCheck, AlertTriangle, Upload, Clipboard } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UploadDPR() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    projectCode: '',
    department: '',
    location: '',
    sector: '',
    estimatedCost: '',
    description: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a DPR file to upload',
        variant: 'destructive'
      })
      return
    }

    // Validate required fields
    const requiredFields = ['title', 'department', 'location', 'sector', 'estimatedCost', 'description'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: 'destructive'
      })
      return;
    }

    setLoading(true)

    try {
      // Simulate file upload and AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Generate a unique ID for the DPR
      const dprId = Date.now().toString();
      const riskLevelOptions = ['Low', 'Medium', 'High'];
      
      // Get risk level from AI model analysis 
      // Temporarily using random assignment until API integration is complete
      const riskIndex = Math.floor(Math.random() * 3);
      const riskLevel = riskLevelOptions[riskIndex];
      
      // Create new DPR record
      const newDpr = {
        id: dprId,
        title: formData.title,
        projectCode: formData.projectCode,
        department: formData.department,
        location: formData.location,
        sector: formData.sector,
        estimatedCost: formData.estimatedCost,
        description: formData.description,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        status: 'Pending', // Initial status
        riskLevel: riskLevel,
        riskFactors: [],
        evaluationDate: null,
        uploadedBy: {
          id: '1', // This would come from the auth context in a real app
          name: 'Current User',
        }
      };
      
      // Store in localStorage
      const storedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
      storedDprs.push(newDpr);
      localStorage.setItem('uploaded-dprs', JSON.stringify(storedDprs));

      // Simulate AI processing and update the DPR status
      setTimeout(() => {
        const updatedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
        const dprIndex = updatedDprs.findIndex((dpr: any) => dpr.id === dprId);
        
        if (dprIndex !== -1) {
          updatedDprs[dprIndex].status = 'Evaluated';
          updatedDprs[dprIndex].evaluationDate = new Date().toISOString();
          
          // Generate some risk factors based on the risk level
          if (riskLevel === 'High') {
            updatedDprs[dprIndex].riskFactors = [
              'Budget overestimation detected',
              'Timeline inconsistencies found',
              'Missing regulatory compliance details'
            ];
          } else if (riskLevel === 'Medium') {
            updatedDprs[dprIndex].riskFactors = [
              'Resource allocation suboptimal',
              'Minor timeline inconsistencies'
            ];
          } else {
            updatedDprs[dprIndex].riskFactors = [
              'No significant issues detected'
            ];
          }
          
          localStorage.setItem('uploaded-dprs', JSON.stringify(updatedDprs));
        }
      }, 5000);

      toast({
        title: 'Success',
        description: 'DPR uploaded successfully. It will be processed for AI evaluation.',
        variant: 'default'
      })
      
      router.push('/dprs')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload DPR. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gov-blue dark:text-white">
            Upload DPR
          </h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Upload Detailed Project Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input 
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectCode">Project Code</Label>
                    <Input 
                      id="projectCode"
                      name="projectCode"
                      value={formData.projectCode}
                      onChange={handleChange}
                      required
                      placeholder="Enter project code"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      placeholder="Enter department name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="State/District"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Input 
                      id="sector"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Infrastructure, Healthcare"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost (₹ in Lakhs)</Label>
                    <Input 
                      id="estimatedCost"
                      name="estimatedCost"
                      type="number"
                      value={formData.estimatedCost}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of the project"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Upload DPR Document</Label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="dropzone-file" 
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF or DOCX (MAX. 20MB)
                        </p>
                        {file && (
                          <p className="mt-2 text-sm text-green-600">
                            Selected: {file.name}
                          </p>
                        )}
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                        Uploading...
                      </>
                    ) : 'Upload DPR'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 p-4 text-center text-sm text-slate-500">
        &copy; 2023 Ministry of Development of North Eastern Region. All rights reserved.
      </footer>
    </div>
  )
}
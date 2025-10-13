'use client'

import React, { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Send, FileUp, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function ReportGenerationPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [reportType, setReportType] = useState<string>('standard')
  const [documentSource, setDocumentSource] = useState<string>('existing')
  const [selectedDocument, setSelectedDocument] = useState<string>('')
  const [customParameters, setCustomParameters] = useState({
    title: 'Risk Assessment Report',
    includeExecutiveSummary: true,
    includeRecommendations: true,
    includeComplianceChecklist: true,
    format: 'pdf'
  })
  
  // Mock documents for selection
  const availableDocuments = [
    { id: 'doc1', name: 'Project Proposal 2023', type: 'DPR', uploadedAt: '2023-06-15' },
    { id: 'doc2', name: 'Financial Audit Report', type: 'DPR', uploadedAt: '2023-07-02' },
    { id: 'doc3', name: 'Quarterly Budget Plan', type: 'DPR', uploadedAt: '2023-07-28' },
    { id: 'doc4', name: 'Compliance Documentation', type: 'DPR', uploadedAt: '2023-08-10' },
    { id: 'doc5', name: 'Risk Management Framework', type: 'DPR', uploadedAt: '2023-08-15' },
  ]
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // In a real app, this would upload the file to the server
    // For now, we'll just simulate success
    setIsLoading(true)
    
    setTimeout(() => {
      const newDocId = `doc${availableDocuments.length + 1}`
      setSelectedDocument(newDocId)
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and selected for report generation.`
      })
      
      setIsLoading(false)
    }, 1500)
  }
  
  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedDocument && documentSource === 'existing') {
      toast({
        title: "No document selected",
        description: "Please select a document to generate a report from.",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    
    // In a real app, this would call an API to generate the report
    // For now, we'll simulate a successful report generation
    
    setTimeout(() => {
      // Generate a random report ID
      const reportId = Math.random().toString(36).substring(2, 9)
      
      // Get document details
      const documentDetails = documentSource === 'existing' 
        ? availableDocuments.find(doc => doc.id === selectedDocument)
        : { name: "Uploaded Document", type: "DPR" }
      
      // Create report metadata
      const newReport = {
        id: reportId,
        title: customParameters.title,
        type: reportType,
        document: documentDetails?.name || 'Unknown Document',
        createdAt: new Date().toISOString(),
        format: customParameters.format,
        status: 'completed'
      }
      
      // Save to localStorage for persistence
      try {
        const existingReports = JSON.parse(localStorage.getItem('generated-reports') || '[]')
        existingReports.unshift(newReport) // Add to beginning of array
        localStorage.setItem('generated-reports', JSON.stringify(existingReports))
      } catch (error) {
        console.error('Error saving report to localStorage:', error)
      }
      
      setIsLoading(false)
      
      toast({
        title: "Report generated successfully",
        description: "Your report is ready to download."
      })
      
      // Redirect to download page
      window.location.href = `/reports/download?id=${reportId}`
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Generate Report"
        subheading="Create customized reports from your documents"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="standard" className="space-y-6" onValueChange={(value) => setReportType(value)}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="standard">Standard Report</TabsTrigger>
          <TabsTrigger value="custom">Custom Report</TabsTrigger>
        </TabsList>
        
        {/* Standard Report Tab */}
        <TabsContent value="standard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Report</CardTitle>
              <CardDescription>
                Generate a standard risk assessment report with predefined parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Document Source</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="existing" 
                        name="documentSource"
                        value="existing"
                        checked={documentSource === 'existing'}
                        onChange={() => setDocumentSource('existing')}
                        className="mr-2"
                      />
                      <Label htmlFor="existing" className="cursor-pointer">Use Existing Document</Label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="upload" 
                        name="documentSource"
                        value="upload"
                        checked={documentSource === 'upload'}
                        onChange={() => setDocumentSource('upload')}
                        className="mr-2"
                      />
                      <Label htmlFor="upload" className="cursor-pointer">Upload New Document</Label>
                    </div>
                  </div>
                </div>
                
                {documentSource === 'existing' ? (
                  <div className="space-y-2">
                    <Label htmlFor="documentSelect">Select Document</Label>
                    <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                      <SelectTrigger id="documentSelect">
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name} - {doc.type} ({new Date(doc.uploadedAt).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fileUpload">Upload Document</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="fileUpload"
                        type="file" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        disabled={isLoading}
                      />
                      <Button variant="outline" disabled={isLoading}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: PDF, Word, Excel
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input 
                    id="reportTitle"
                    value={customParameters.title}
                    onChange={(e) => setCustomParameters({...customParameters, title: e.target.value})}
                    placeholder="Enter report title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formatSelect">Output Format</Label>
                  <Select 
                    value={customParameters.format} 
                    onValueChange={(value) => setCustomParameters({...customParameters, format: value})}
                  >
                    <SelectTrigger id="formatSelect">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isLoading || (documentSource === 'existing' && !selectedDocument)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Custom Report Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report</CardTitle>
              <CardDescription>
                Create a tailored report with customized parameters and sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Document Source</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="existing-custom" 
                        name="documentSourceCustom"
                        value="existing"
                        checked={documentSource === 'existing'}
                        onChange={() => setDocumentSource('existing')}
                        className="mr-2"
                      />
                      <Label htmlFor="existing-custom" className="cursor-pointer">Use Existing Document</Label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="upload-custom" 
                        name="documentSourceCustom"
                        value="upload"
                        checked={documentSource === 'upload'}
                        onChange={() => setDocumentSource('upload')}
                        className="mr-2"
                      />
                      <Label htmlFor="upload-custom" className="cursor-pointer">Upload New Document</Label>
                    </div>
                  </div>
                </div>
                
                {documentSource === 'existing' ? (
                  <div className="space-y-2">
                    <Label htmlFor="documentSelectCustom">Select Document</Label>
                    <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                      <SelectTrigger id="documentSelectCustom">
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name} - {doc.type} ({new Date(doc.uploadedAt).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fileUploadCustom">Upload Document</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="fileUploadCustom"
                        type="file" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        disabled={isLoading}
                      />
                      <Button variant="outline" disabled={isLoading}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: PDF, Word, Excel
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="reportTitleCustom">Report Title</Label>
                  <Input 
                    id="reportTitleCustom"
                    value={customParameters.title}
                    onChange={(e) => setCustomParameters({...customParameters, title: e.target.value})}
                    placeholder="Enter report title"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center space-x-2 mb-4">
                      <input 
                        type="checkbox" 
                        checked={customParameters.includeExecutiveSummary} 
                        onChange={(e) => setCustomParameters({
                          ...customParameters, 
                          includeExecutiveSummary: e.target.checked
                        })} 
                        className="mr-2"
                      />
                      Include Executive Summary
                    </Label>
                    
                    <Label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={customParameters.includeRecommendations} 
                        onChange={(e) => setCustomParameters({
                          ...customParameters, 
                          includeRecommendations: e.target.checked
                        })} 
                        className="mr-2"
                      />
                      Include Recommendations
                    </Label>
                  </div>
                  
                  <div>
                    <Label className="flex items-center space-x-2 mb-4">
                      <input 
                        type="checkbox" 
                        checked={customParameters.includeComplianceChecklist} 
                        onChange={(e) => setCustomParameters({
                          ...customParameters, 
                          includeComplianceChecklist: e.target.checked
                        })} 
                        className="mr-2"
                      />
                      Include Compliance Checklist
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formatSelectCustom">Output Format</Label>
                  <Select 
                    value={customParameters.format} 
                    onValueChange={(value) => setCustomParameters({...customParameters, format: value})}
                  >
                    <SelectTrigger id="formatSelectCustom">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea 
                    id="additionalNotes"
                    placeholder="Enter any additional notes or requirements for the report"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isLoading || (documentSource === 'existing' && !selectedDocument)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
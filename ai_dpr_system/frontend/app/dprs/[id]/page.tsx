'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { downloadFile } from '@/lib/utils'

export default function DPRDetails({ params }: { params: { id: string } }) {
  const [dpr, setDpr] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    try {
      // Get DPR from localStorage
      const storedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]')
      const foundDpr = storedDprs.find((item: any) => item.id.toString() === params.id)
      
      if (foundDpr) {
        // Add additional evaluation data if it's evaluated but doesn't have evaluation details
        if (foundDpr.status === 'Evaluated' && !foundDpr.evaluation) {
          foundDpr.evaluation = {
            completeness: Math.floor(Math.random() * 20) + 65, // 65-85
            clarity: Math.floor(Math.random() * 20) + 65,
            feasibility: Math.floor(Math.random() * 25) + 60,
            budget: Math.floor(Math.random() * 25) + 60,
            timeline: Math.floor(Math.random() * 20) + 65,
            compliance: Math.floor(Math.random() * 20) + 70,
            sustainability: Math.floor(Math.random() * 25) + 60,
            overall: Math.floor(Math.random() * 15) + 70,
            comments: []
          };

          // Add comments based on risk level
          if (foundDpr.riskLevel === 'High') {
            foundDpr.evaluation.comments = [
              {
                section: 'Budget',
                comment: 'The project budget appears significantly overestimated and lacks detailed breakdowns.',
                severity: 'High'
              },
              {
                section: 'Timeline',
                comment: 'Implementation schedule is unrealistic given the constraints and requirements.',
                severity: 'High'
              },
              {
                section: 'Compliance',
                comment: 'Several regulatory compliance requirements are not adequately addressed.',
                severity: 'Medium'
              }
            ];
          } else if (foundDpr.riskLevel === 'Medium') {
            foundDpr.evaluation.comments = [
              {
                section: 'Resource Allocation',
                comment: 'Resource allocation seems suboptimal and could be improved.',
                severity: 'Medium'
              },
              {
                section: 'Timeline',
                comment: 'Minor timeline inconsistencies detected that should be addressed.',
                severity: 'Medium'
              },
              {
                section: 'Technical Details',
                comment: 'Technical specifications are well documented and appropriate.',
                severity: 'Low'
              }
            ];
          } else {
            foundDpr.evaluation.comments = [
              {
                section: 'Overall Assessment',
                comment: 'The DPR is well prepared with proper attention to detail.',
                severity: 'Low'
              },
              {
                section: 'Budget',
                comment: 'Budget allocation is reasonable and well justified.',
                severity: 'Low'
              },
              {
                section: 'Implementation',
                comment: 'Implementation plan is comprehensive and realistic.',
                severity: 'Low'
              }
            ];
          }

          // Add risk analysis data if not present
          if (!foundDpr.risk) {
            foundDpr.risk = {
              level: foundDpr.riskLevel,
              factors: []
            };

            // Add risk factors based on risk level
            if (foundDpr.riskLevel === 'High') {
              foundDpr.risk.factors = [
                {
                  category: 'Financial',
                  description: 'Budget overestimation and lack of detailed breakdown',
                  probability: 'High',
                  impact: 'High',
                  mitigation: 'Complete budget reassessment with detailed itemization'
                },
                {
                  category: 'Timeline',
                  description: 'Unrealistic implementation schedule',
                  probability: 'High',
                  impact: 'Medium',
                  mitigation: 'Develop a more realistic timeline with buffer periods'
                },
                {
                  category: 'Compliance',
                  description: 'Missing regulatory compliance details',
                  probability: 'Medium',
                  impact: 'High',
                  mitigation: 'Conduct thorough regulatory review and address gaps'
                }
              ];
            } else if (foundDpr.riskLevel === 'Medium') {
              foundDpr.risk.factors = [
                {
                  category: 'Resource',
                  description: 'Suboptimal resource allocation',
                  probability: 'Medium',
                  impact: 'Medium',
                  mitigation: 'Review and optimize resource allocation plan'
                },
                {
                  category: 'Timeline',
                  description: 'Minor timeline inconsistencies',
                  probability: 'Medium',
                  impact: 'Low',
                  mitigation: 'Adjust timeline to address inconsistencies'
                }
              ];
            } else {
              foundDpr.risk.factors = [
                {
                  category: 'General',
                  description: 'No significant issues detected',
                  probability: 'Low',
                  impact: 'Low',
                  mitigation: 'Continue with regular monitoring and reporting'
                }
              ];
            }
          }
        }
        
        setDpr(foundDpr)
      } else {
        toast({
          title: "DPR not found",
          description: "The requested DPR could not be found",
          variant: "destructive"
        })
        router.push('/dprs')
      }
    } catch (error) {
      console.error("Error loading DPR:", error)
      toast({
        title: "Error",
        description: "Failed to load DPR details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, router, toast])
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading DPR details...</p>
      </div>
    )
  }

  if (!dpr) {
    return null // Redirecting is handled in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gov-blue dark:text-white">
                DPR Details
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {dpr.projectCode} - {dpr.title}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push('/dprs')}>
                Back to DPRs
              </Button>
              {dpr.status === 'Evaluated' && (
                <Button onClick={() => router.push(`/dprs/${dpr.id}/risk-analysis`)}>
                  View Risk Analysis
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6">
        <div className="container mx-auto max-w-5xl">
          {/* Project overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Project Title</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Project Code</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.projectCode}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Department</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Location</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.location}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Sector</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.sector}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Estimated Cost</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">₹ {dpr.estimatedCost ? dpr.estimatedCost.toLocaleString() : 'N/A'} Lakhs</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Upload Date</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.uploadDate ? new Date(dpr.uploadDate).toLocaleDateString() : 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dpr.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          dpr.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {dpr.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-500">Project Description</h4>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">{dpr.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Generate PDF content from DPR data
                      const pdfContent = `
                        <html>
                          <head>
                            <title>${dpr.title}</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 40px; }
                              h1 { color: #1a56db; }
                              .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
                              .section { margin-bottom: 20px; }
                              .label { font-weight: bold; color: #4b5563; }
                              .value { margin-top: 5px; }
                              .footer { margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1>${dpr.title}</h1>
                              <p>Project Code: ${dpr.projectCode}</p>
                            </div>
                            
                            <div class="section">
                              <div class="label">Department:</div>
                              <div class="value">${dpr.department}</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Location:</div>
                              <div class="value">${dpr.location}</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Sector:</div>
                              <div class="value">${dpr.sector}</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Estimated Cost:</div>
                              <div class="value">₹ ${dpr.estimatedCost ? dpr.estimatedCost.toLocaleString() : 'N/A'} Lakhs</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Description:</div>
                              <div class="value">${dpr.description}</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Upload Date:</div>
                              <div class="value">${new Date(dpr.uploadDate).toLocaleDateString()}</div>
                            </div>
                            
                            <div class="section">
                              <div class="label">Status:</div>
                              <div class="value">${dpr.status}</div>
                            </div>
                            
                            <div class="footer">
                              Generated from Ministry of Development of North Eastern Region DPR Management System
                            </div>
                          </body>
                        </html>
                      `;
                      
                      // Create a blob with the HTML content
                      const blob = new Blob([pdfContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      
                      // Open the document in a new tab/window
                      window.open(url, '_blank');
                    }}
                  >
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    </span>
                    View DPR Document
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Create document content for download
                      const content = `
DPR Details: ${dpr.title || 'N/A'}
Project Code: ${dpr.projectCode || 'N/A'}
Department: ${dpr.department || 'N/A'}
Location: ${dpr.location || 'N/A'}
Sector: ${dpr.sector || 'N/A'}
Estimated Cost: ₹ ${dpr.estimatedCost ? dpr.estimatedCost.toLocaleString() : 'N/A'} Lakhs
Description: ${dpr.description || 'N/A'}
Upload Date: ${dpr.uploadDate ? new Date(dpr.uploadDate).toLocaleDateString() : 'N/A'}
Status: ${dpr.status || 'N/A'}

Generated from Ministry of Development of North Eastern Region DPR Management System
                      `;
                      
                      // Create a blob with the content
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      
                      // Use the downloadFile utility function
                      downloadFile(url, `${dpr.title.replace(/\s+/g, '_')}_DPR.txt`);
                    }}
                  >
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </span>
                    Download DPR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Evaluation */}
          {dpr.status === 'Evaluated' && dpr.evaluation && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Evaluation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-slate-500 mb-4">Evaluation Scores</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(dpr.evaluation).filter(([key]) => key !== 'comments').map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-medium text-slate-500 capitalize">{key}</div>
                        <div className="mt-1 flex items-baseline">
                          <div className="text-2xl font-semibold">
                            {typeof value === 'number' ? value : 0}%
                          </div>
                          <div className="ml-2 text-xs font-medium text-slate-500">
                            /100
                          </div>
                        </div>
                        <div className="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (typeof value === 'number' && value >= 80) ? 'bg-green-500' :
                              (typeof value === 'number' && value >= 60) ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${typeof value === 'number' ? value : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-4">AI Comments</h4>
                  <div className="space-y-4">
                    {dpr.evaluation.comments.map((comment, index) => (
                      <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{comment.section}</div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            comment.severity === 'High' ? 'bg-red-100 text-red-800' :
                            comment.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {comment.severity} Priority
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                          {comment.comment}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 p-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Ministry of Development of North Eastern Region. All rights reserved.
      </footer>
    </div>
  )
}
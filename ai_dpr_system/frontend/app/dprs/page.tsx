'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, FileCheck, AlertTriangle, Clock, BarChart, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface DPR {
  id: number
  title: string
  projectCode: string
  department: string
  location: string
  sector: string
  estimatedCost: number
  uploadDate: string
  status: 'Pending' | 'In Progress' | 'Evaluated'
  riskLevel: 'Low' | 'Medium' | 'High'
}

export default function DPRs() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Initialize DPRs state
  const [dprs, setDprs] = useState<DPR[]>([])
  
  // Load DPRs from localStorage on component mount
  useEffect(() => {
    try {
      const storedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]');
      
      setDprs(storedDprs);
      
      if (storedDprs.length === 0) {
        toast({
          title: "No DPRs Found",
          description: "Please upload DPRs to get started.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error loading DPRs:", error);
      toast({
        title: "Error",
        description: "Failed to load DPRs from storage",
        variant: "destructive"
      });
    }
  }, [toast])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<{
    status: string;
    riskLevel: string;
  }>({
    status: '',
    riskLevel: '',
  })
  
  // Filter and search functionality
  const filteredDPRs = dprs.filter((dpr) => {
    const matchesSearch = dpr.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dpr.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dpr.department.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesStatus = filter.status === '' || dpr.status === filter.status;
    const matchesRisk = filter.riskLevel === '' || dpr.riskLevel === filter.riskLevel;
    
    return matchesSearch && matchesStatus && matchesRisk;
  })
  
  const handleFilterChange = (key: 'status' | 'riskLevel', value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Evaluated':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getRiskBadgeClass = (risk: string) => {
    switch(risk) {
      case 'Low':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gov-blue dark:text-white">
            DPR Management
          </h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push('/dprs/upload')}>
              Upload New DPR
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6">
        <div className="container mx-auto">
          {/* Risk Distribution Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">DPR Status</CardTitle>
                  <Clock className="h-4 w-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold">
                        {dprs.filter(d => d.status === 'Evaluated').length}
                        <span className="text-xs font-normal text-slate-500 ml-1">/{dprs.length}</span>
                      </p>
                      <p className="text-xs text-slate-500">Evaluated</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {dprs.filter(d => d.status === 'Pending').length} Pending
                      </p>
                      <p className="text-sm font-medium">
                        {dprs.filter(d => d.status === 'In Progress').length} In Progress
                      </p>
                    </div>
                  </div>
                  <div className="h-16 w-16 relative">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200" strokeWidth="2"></circle>
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="16" 
                        fill="none" 
                        className="stroke-blue-500" 
                        strokeWidth="2"
                        strokeDasharray={`${(dprs.filter(d => d.status === 'Evaluated').length / dprs.length) * 100}, 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Risk Distribution</CardTitle>
                  <BarChart className="h-4 w-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <p className="text-sm">High Risk</p>
                    </div>
                    <p className="font-medium">{dprs.filter(d => d.riskLevel === 'High').length}</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <p className="text-sm">Medium Risk</p>
                    </div>
                    <p className="font-medium">{dprs.filter(d => d.riskLevel === 'Medium').length}</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm">Low Risk</p>
                    </div>
                    <p className="font-medium">{dprs.filter(d => d.riskLevel === 'Low').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Latest Activity</CardTitle>
                  <Activity className="h-4 w-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...dprs].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                    .slice(0, 2)
                    .map((dpr, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{dpr.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(dpr.uploadDate).toLocaleDateString()} • {dpr.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs justify-center mt-1"
                    onClick={() => router.push('/dashboard')}
                  >
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>DPR List</CardTitle>
                  <CardDescription>
                    Total {dprs.length} DPRs • {dprs.filter(d => d.riskLevel === 'High').length} High Risk
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative w-full sm:w-1/3">
                  <input
                    type="text"
                    placeholder="Search DPRs..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                </div>

                {/* Filters */}
                <div className="flex space-x-4">
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filter.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Evaluated">Evaluated</option>
                  </select>
                  
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filter.riskLevel}
                    onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                  >
                    <option value="">All Risk Levels</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              {/* DPR Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost (₹ Lakhs)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredDPRs.length > 0 ? (
                      filteredDPRs.map((dpr) => (
                        <tr 
                          key={dpr.id} 
                          className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => router.push(`/dprs/${dpr.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {dpr.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {dpr.projectCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {dpr.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {dpr.estimatedCost ? dpr.estimatedCost.toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(dpr.status)}`}>
                              {dpr.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClass(dpr.riskLevel)}`}>
                                {dpr.riskLevel}
                              </span>
                              {dpr.riskLevel === 'High' && (
                                <div className="ml-2" title="High risk level detected">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {new Date(dpr.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dprs/${dpr.id}`)}
                            >
                              View
                            </Button>
                            {dpr.status === 'Evaluated' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/dprs/${dpr.id}/risk-analysis`)}
                              >
                                Risk Analysis
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                          No DPRs found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 p-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Ministry of Development of North Eastern Region. All rights reserved.
      </footer>
    </div>
  )
}
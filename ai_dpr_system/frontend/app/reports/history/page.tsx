'use client'

import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart, CalendarDays, Download, Eye, FileText, Clock, ArrowUpDown, Filter, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock history interface
interface ReportHistory {
  id: string
  title: string
  type: 'risk-assessment' | 'compliance' | 'summary' | 'detailed'
  createdAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  documentId: string
  documentName: string
  status: 'completed' | 'in-progress' | 'failed'
  downloadUrl?: string
}

export default function ViewHistoryPage() {
  // State for report history
  const [history, setHistory] = useState<ReportHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ReportHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportHistory | null>(null)
  
  // Generate random IDs
  const generateId = () => Math.random().toString(36).substring(2, 9)
  
  // Load report history from localStorage or generate mock data
  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true)
      
      // Try to load from localStorage
      const storedHistory = localStorage.getItem('report-history')
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory)
          setHistory(parsedHistory)
          setFilteredHistory(parsedHistory)
          setIsLoading(false)
          return
        } catch (error) {
          console.error('Error parsing stored history:', error)
        }
      }
      
      // Generate mock data if not available in localStorage
      const mockHistory = generateMockHistory()
      setHistory(mockHistory)
      setFilteredHistory(mockHistory)
      
      // Store in localStorage for persistence
      localStorage.setItem('report-history', JSON.stringify(mockHistory))
      setIsLoading(false)
    }
    
    loadHistory()
  }, [])
  
  // Filter history based on search query, type, and date range
  useEffect(() => {
    let filtered = [...history]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.documentName.toLowerCase().includes(query) ||
        item.createdBy.name.toLowerCase().includes(query)
      )
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType)
    }
    
    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt)
        
        switch (dateRange) {
          case 'today':
            return itemDate >= today
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(today.getDate() - 7)
            return itemDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(today.getMonth() - 1)
            return itemDate >= monthAgo
          default:
            return true
        }
      })
    }
    
    setFilteredHistory(filtered)
  }, [searchQuery, filterType, dateRange, history])
  
  // Generate mock history data
  const generateMockHistory = (): ReportHistory[] => {
    const reportTypes = ['risk-assessment', 'compliance', 'summary', 'detailed'] as const
    const documentNames = [
      'Project Proposal 2023', 
      'Financial Audit Report', 
      'Quarterly Budget Plan', 
      'Compliance Documentation', 
      'Risk Management Framework',
      'Market Analysis Report',
      'Annual Strategic Plan'
    ]
    const users = [
      { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
      { id: '2', name: 'Priya Patel', email: 'priya.patel@example.com' },
      { id: '3', name: 'Amit Singh', email: 'amit.singh@example.com' },
      { id: '4', name: 'Neha Gupta', email: 'neha.gupta@example.com' }
    ]
    const statuses = ['completed', 'in-progress', 'failed'] as const
    
    const mockHistory: ReportHistory[] = []
    
    // Generate reports for the past 3 months
    const now = new Date()
    
    for (let i = 0; i < 20; i++) {
      // Random date within the past 3 months
      const date = new Date(now)
      date.setDate(now.getDate() - Math.floor(Math.random() * 90))
      
      // Random values
      const type = reportTypes[Math.floor(Math.random() * reportTypes.length)]
      const user = users[Math.floor(Math.random() * users.length)]
      const docName = documentNames[Math.floor(Math.random() * documentNames.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      mockHistory.push({
        id: generateId(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Report`,
        type,
        createdAt: date.toISOString(),
        createdBy: user,
        documentId: generateId(),
        documentName: docName,
        status,
        downloadUrl: status === 'completed' ? '#' : undefined
      })
    }
    
    // Sort by date (newest first)
    return mockHistory.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }
  
  // View report details
  const handleViewReport = (report: ReportHistory) => {
    setSelectedReport(report)
    setViewDialogOpen(true)
  }
  
  // Download report
  const handleDownload = (report: ReportHistory) => {
    if (report.status !== 'completed') {
      alert('Report is not ready for download yet.')
      return
    }
    
    // In a real app, this would download the actual file
    // For demo purposes, we'll just show an alert
    alert(`Downloading report: ${report.title}`)
    
    // Simulate download behavior
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock Report Content'))
    element.setAttribute('download', `${report.title.replace(' ', '_')}_${report.documentName.replace(' ', '_')}.pdf`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  
  // Generate new report based on existing one
  const handleGenerateNew = (report: ReportHistory) => {
    // In a real app, this would initiate a new report generation
    // For demo purposes, we'll create a new entry in the history
    
    const newReport: ReportHistory = {
      ...report,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'in-progress'
    }
    
    const updatedHistory = [newReport, ...history]
    setHistory(updatedHistory)
    localStorage.setItem('report-history', JSON.stringify(updatedHistory))
    
    // Close dialog if open
    setViewDialogOpen(false)
    
    // Show success message
    alert('New report generation started. You can track its progress in the history.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Report History"
        subheading="View and manage previously generated reports"
        icon={<Clock className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/reports/export">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Link>
            </Button>
            <Button onClick={() => {
              // Export all as CSV
              window.location.href = '/reports/export'
            }}>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        }
      />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found</p>
              {(searchQuery || filterType !== 'all' || dateRange !== 'all') && (
                <Button variant="link" onClick={() => {
                  setSearchQuery('')
                  setFilterType('all')
                  setDateRange('all')
                }}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Report Title</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map(report => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        report.type === 'risk-assessment' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                        report.type === 'compliance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        report.type === 'summary' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }>
                        {report.type.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.documentName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(report.createdAt)}</span>
                        <span className="text-xs text-muted-foreground">by {report.createdBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        report.status === 'completed' ? 'default' :
                        report.status === 'in-progress' ? 'outline' : 'destructive'
                      }>
                        {report.status === 'in-progress' ? 'In Progress' : 
                         report.status === 'completed' ? 'Completed' : 'Failed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewReport(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDownload(report)}
                          disabled={report.status !== 'completed'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleGenerateNew(report)}
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <p className="text-sm font-medium">{selectedReport.title}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm font-medium">{selectedReport.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <Label>Document</Label>
                  <p className="text-sm font-medium">{selectedReport.documentName}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm font-medium">{selectedReport.status}</p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm font-medium">{formatDate(selectedReport.createdAt)}</p>
                </div>
                <div>
                  <Label>Created By</Label>
                  <p className="text-sm font-medium">{selectedReport.createdBy.name}</p>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Report Content Preview</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.status === 'completed' ? 
                    'Report content would be displayed here in a real application.' :
                    selectedReport.status === 'in-progress' ? 
                      'This report is still being generated. Check back soon.' :
                      'This report failed to generate. Please try creating a new one.'
                  }
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedReport && (
              <>
                {selectedReport.status === 'completed' && (
                  <Button onClick={() => handleDownload(selectedReport)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
                <Button onClick={() => handleGenerateNew(selectedReport)}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Generate New Report
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
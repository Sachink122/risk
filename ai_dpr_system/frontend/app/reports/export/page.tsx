'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { FilesIcon, Download, DownloadCloud, CheckCircle, Calendar, Filter, Search, FileText } from 'lucide-react'
import Link from 'next/link'

// Report interface
interface Report {
  id: string
  title: string
  type: string
  format: string
  documentName: string
  createdAt: string
  status: string
  size?: string
}

export default function ExportReportsPage() {
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  
  const [selectedFormat, setSelectedFormat] = useState('original')
  const [isExporting, setIsExporting] = useState(false)
  
  // Load reports data
  useEffect(() => {
    // Try to load from localStorage first
    const storedReports = localStorage.getItem('generated-reports')
    let reportsData: Report[] = []
    
    if (storedReports) {
      try {
        reportsData = JSON.parse(storedReports)
      } catch (error) {
        console.error('Error parsing stored reports:', error)
      }
    }
    
    // If no reports in localStorage, check report-history
    if (!reportsData || reportsData.length === 0) {
      const historyData = localStorage.getItem('report-history')
      if (historyData) {
        try {
          const parsedHistory = JSON.parse(historyData)
          reportsData = parsedHistory.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            format: 'pdf', // Assuming default format
            documentName: item.documentName || item.document,
            createdAt: item.createdAt,
            status: item.status
          }))
        } catch (error) {
          console.error('Error parsing history data:', error)
        }
      }
    }
    
    // Initialize with empty array if no data
    if (!reportsData) {
      reportsData = []
    }
    
    setReports(reportsData.filter(r => r.status === 'completed'))
  }, [])
  
  // No sample data generation needed
  
  // Filter reports based on search, date, format, and type
  const filteredReports = reports.filter(report => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.documentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (dateRange !== 'all') {
      const reportDate = new Date(report.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateRange === 'today') {
        matchesDate = reportDate >= today;
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = reportDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDate = reportDate >= monthAgo;
      }
    }
    
    // Format filter
    const matchesFormat = formatFilter === 'all' || report.format === formatFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesDate && matchesFormat && matchesType;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }
  
  // Toggle report selection
  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  }
  
  // Toggle selection of all filtered reports
  const toggleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  }
  
  // Handle export
  const handleExport = () => {
    if (selectedReports.length === 0) {
      toast({
        title: "No reports selected",
        description: "Please select at least one report to export.",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export successful",
        description: `${selectedReports.length} reports have been packaged for download.`,
        variant: "default"
      });
      
      setIsExporting(false);
      
      // In a real app, this would trigger a file download
      // For demo purposes, we'll simulate it
      if (selectedReports.length === 1) {
        window.location.href = `/reports/download?id=${selectedReports[0]}`;
      } else {
        // For multiple files, we'd normally create a ZIP file
        // For demo, we'll just redirect to the batch download page
        window.location.href = `/reports/download/batch?batch=true&ids=${selectedReports.join(',')}`;
      }
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Export Reports"
        subheading="Export and download reports in batch"
        icon={<FilesIcon className="h-6 w-6" />}
      />
      
      {/* Filters Section */}
      <Card className="dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
          <CardDescription>Narrow down the reports you want to export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="pl-9 bg-background dark:bg-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px] bg-background dark:bg-slate-900">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="w-[150px] bg-background dark:bg-slate-900">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-background dark:bg-slate-900">
                  <SelectValue placeholder="Report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Selection */}
      <Card className="dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="selectAll"
              checked={filteredReports.length > 0 && selectedReports.length === filteredReports.length}
              onCheckedChange={toggleSelectAll}
            />
            <Label htmlFor="selectAll">Select All</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredReports.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">No reports found matching your filters</p>
                {(searchQuery || dateRange !== 'all' || formatFilter !== 'all' || typeFilter !== 'all') && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('')
                      setDateRange('all')
                      setFormatFilter('all')
                      setTypeFilter('all')
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              filteredReports.map(report => (
                <div 
                  key={report.id} 
                  className="flex items-center gap-3 p-3 border rounded-md dark:border-slate-700"
                >
                  <Checkbox 
                    id={`report-${report.id}`}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => toggleReportSelection(report.id)}
                  />
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                    <div className="md:col-span-2">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">{report.documentName}</p>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Type:</span>{" "}
                      <span className="capitalize">{report.type}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Format:</span>{" "}
                      <span className="uppercase">{report.format}</span>
                    </div>
                    
                    <div className="text-sm">
                      <Calendar className="inline-block h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={() => toggleReportSelection(report.id)}>
                    {selectedReports.includes(report.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <Card className="dark:border-slate-800">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Configure export settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="bg-background dark:bg-slate-900">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Format</SelectItem>
                  <SelectItem value="pdf">Convert All to PDF</SelectItem>
                  <SelectItem value="docx">Convert All to Word</SelectItem>
                  <SelectItem value="xlsx">Convert All to Excel</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Choose whether to keep original formats or convert all to a single format
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Export Method</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="zipFile" name="exportMethod" checked className="h-4 w-4" />
                  <Label htmlFor="zipFile">Single ZIP File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="individual" name="exportMethod" disabled className="h-4 w-4" />
                  <Label htmlFor="individual" className="text-muted-foreground">Individual Files (Pro Feature)</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/reports">Cancel</Link>
          </Button>
          
          <Button 
            onClick={handleExport} 
            disabled={selectedReports.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export {selectedReports.length > 0 ? `(${selectedReports.length})` : ''}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
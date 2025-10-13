'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { AdminIcons } from '@/components/admin-icons';
import { Download, Search, Filter, Calendar, ChevronDown, ArrowDownToLine } from 'lucide-react';

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all-time');

  React.useEffect(() => {
    // Load reports data from localStorage
    try {
      const savedReports = localStorage.getItem('generated-reports');
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        setReports(parsedReports);
      } else {
        // No reports found, initialize with empty array
        setReports([]);
      }
    } catch (e) {
      console.error('Error loading reports:', e);
      setReports([]);
    }
  }, []);

  const filteredReports = React.useMemo(() => {
    let filtered = [...reports];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all-time') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'this-week':
          cutoffDate = new Date(now.setDate(now.getDate() - now.getDay()));
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'this-month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last-30-days':
          cutoffDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'last-90-days':
          cutoffDate = new Date(now.setDate(now.getDate() - 90));
          break;
      }
      
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= cutoffDate;
      });
    }
    
    // Sort by date (most recent first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, searchTerm, dateFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">{status}</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">{status}</Badge>;
      case 'Failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('Reports')}</h2>
          <p className="text-muted-foreground">{t('Manage and download system reports and analytics.')}</p>
        </div>
        <Button className="flex items-center">
          <AdminIcons.Reports className="mr-2 h-4 w-4" />
          {t('Generate New Report')}
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <AdminIcons.Analytics className="mr-2 h-5 w-5 text-primary" />
                {t('All Reports')}
              </CardTitle>
              <CardDescription>
                {t('Access and download system-generated reports')}
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search reports...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 w-full"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px] flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t('Filter by date')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">{t('All Time')}</SelectItem>
                  <SelectItem value="today">{t('Today')}</SelectItem>
                  <SelectItem value="this-week">{t('This Week')}</SelectItem>
                  <SelectItem value="this-month">{t('This Month')}</SelectItem>
                  <SelectItem value="last-30-days">{t('Last 30 Days')}</SelectItem>
                  <SelectItem value="last-90-days">{t('Last 90 Days')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t('Report ID')}</TableHead>
                <TableHead>{t('Title')}</TableHead>
                <TableHead>{t('Date')}</TableHead>
                <TableHead>{t('Type')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead>{t('Size')}</TableHead>
                <TableHead className="text-right">{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('Download')}>
                        <ArrowDownToLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {searchTerm || dateFilter !== 'all-time' 
                      ? t('No reports match your search criteria')
                      : t('No reports generated yet')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-3 bg-muted/30 flex justify-between">
          <div className="text-sm text-muted-foreground">
            {t('Showing {{count}} reports', { count: filteredReports.length })}
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            {t('Export All')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
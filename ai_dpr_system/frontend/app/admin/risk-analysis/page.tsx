'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AdminIcons } from '@/components/admin-icons';
import { AlertTriangle, ChevronDown, Search, AlertCircle, CheckCircle, AlertOctagon, BarChart, ArrowRight, Eye } from 'lucide-react';

// Minimal shape of a DPR item used in this page
type DprItem = {
  id: string;
  title: string;
  uploaderName?: string;
  uploadDate: string;
  riskScore: number;
  status: 'Critical' | 'Flagged' | 'Under Review' | 'Approved' | string;
  riskFactors?: string[];
};

export default function AdminRiskAnalysisPage() {
  const { t } = useTranslation();
  const [highRiskDprs, setHighRiskDprs] = React.useState<DprItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('risk-desc');
  const [riskThreshold, setRiskThreshold] = React.useState<string>('0.7');

  React.useEffect(() => {
    // Load DPRs data from localStorage
    try {
      const savedDprs = localStorage.getItem('uploaded-dprs');
      if (savedDprs) {
        const parsed = JSON.parse(savedDprs) as unknown;
        const arr = Array.isArray(parsed) ? parsed : [];
        // Normalize items to DprItem shape with numeric riskScore
        const normalized: DprItem[] = arr.map((item: any): DprItem => ({
          id: String(item?.id ?? ''),
          title: String(item?.title ?? ''),
          uploaderName: item?.uploaderName ? String(item.uploaderName) : undefined,
          uploadDate: String(item?.uploadDate ?? new Date().toISOString()),
          riskScore: typeof item?.riskScore === 'number' ? item.riskScore : parseFloat(String(item?.riskScore ?? '0')),
          status: item?.status ? String(item.status) : 'Under Review',
          riskFactors: Array.isArray(item?.riskFactors) ? item.riskFactors.map((f: any) => String(f)) : [],
        }));
        // Filter high risk DPRs (risk score > threshold)
        const threshold = parseFloat(riskThreshold);
        setHighRiskDprs(normalized.filter((dpr: DprItem) => dpr.riskScore > threshold));
      } else {
        // No DPRs found, initialize with empty arrays
        setHighRiskDprs([]);
        localStorage.setItem('uploaded-dprs', JSON.stringify([]));
      }
    } catch (e) {
      console.error('Error loading DPRs:', e);
      setHighRiskDprs([]);
    }
  }, [riskThreshold]);

  const filteredDprs = React.useMemo(() => {
    let filtered: DprItem[] = [...highRiskDprs];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((dpr: DprItem) => 
        dpr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dpr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dpr.uploaderName && dpr.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'risk-desc':
        filtered.sort((a: DprItem, b: DprItem) => b.riskScore - a.riskScore);
        break;
      case 'risk-asc':
        filtered.sort((a: DprItem, b: DprItem) => a.riskScore - b.riskScore);
        break;
      case 'date-desc':
        filtered.sort((a: DprItem, b: DprItem) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'date-asc':
        filtered.sort((a: DprItem, b: DprItem) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
    }
    
    return filtered;
  }, [highRiskDprs, searchTerm, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">{status}</Badge>;
      case 'Flagged':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">{status}</Badge>;
      case 'Under Review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">{status}</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 0.9) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 flex items-center gap-1">
        <AlertOctagon className="h-3.5 w-3.5" />
        {(riskScore * 100).toFixed(0)}%
      </Badge>;
    } else if (riskScore >= 0.8) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 flex items-center gap-1">
        <AlertTriangle className="h-3.5 w-3.5" />
        {(riskScore * 100).toFixed(0)}%
      </Badge>;
    } else if (riskScore >= 0.7) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 flex items-center gap-1">
        <AlertCircle className="h-3.5 w-3.5" />
        {(riskScore * 100).toFixed(0)}%
      </Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 flex items-center gap-1">
        <CheckCircle className="h-3.5 w-3.5" />
        {(riskScore * 100).toFixed(0)}%
      </Badge>;
    }
  };

  // Calculate statistics for the dashboard
  const stats = React.useMemo(() => {
  const criticalCount = highRiskDprs.filter((dpr: DprItem) => dpr.riskScore >= 0.9).length;
  const highCount = highRiskDprs.filter((dpr: DprItem) => dpr.riskScore >= 0.8 && dpr.riskScore < 0.9).length;
  const moderateCount = highRiskDprs.filter((dpr: DprItem) => dpr.riskScore >= 0.7 && dpr.riskScore < 0.8).length;
    
    return {
      critical: criticalCount,
      high: highCount,
      moderate: moderateCount,
      total: highRiskDprs.length
    };
  }, [highRiskDprs]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('Risk Analysis')}</h2>
          <p className="text-muted-foreground">{t('Review and manage high risk DPR submissions.')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={riskThreshold} onValueChange={setRiskThreshold}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('Risk Threshold')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.7">{t('High Risk (>70%)')}</SelectItem>
              <SelectItem value="0.8">{t('Very High Risk (>80%)')}</SelectItem>
              <SelectItem value="0.9">{t('Critical Risk (>90%)')}</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center">
            <AdminIcons.Analytics className="mr-2 h-4 w-4" />
            {t('Generate Report')}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Critical Risk DPRs')}
            </CardTitle>
            <div className="bg-red-100 p-2 rounded-full">
              <AlertOctagon className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="text-2xl font-bold">{stats.critical}</div>
            <div className="text-xs text-red-600 mt-1">
              {t('Requires immediate attention')}
            </div>
          </CardContent>
          <CardFooter className="py-2 px-6 bg-muted/30">
            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center">
              {t('View Details')}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('High Risk DPRs')}
            </CardTitle>
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="text-2xl font-bold">{stats.high}</div>
            <div className="text-xs text-orange-600 mt-1">
              {t('Requires thorough review')}
            </div>
          </CardContent>
          <CardFooter className="py-2 px-6 bg-muted/30">
            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center">
              {t('View Details')}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Moderate Risk DPRs')}
            </CardTitle>
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="text-2xl font-bold">{stats.moderate}</div>
            <div className="text-xs text-amber-600 mt-1">
              {t('Requires attention')}
            </div>
          </CardContent>
          <CardFooter className="py-2 px-6 bg-muted/30">
            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center">
              {t('View Details')}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Total Flagged DPRs')}
            </CardTitle>
            <div className="bg-blue-100 p-2 rounded-full">
              <BarChart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-blue-600 mt-1">
              {t('All high risk submissions')}
            </div>
          </CardContent>
          <CardFooter className="py-2 px-6 bg-muted/30">
            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center">
              {t('View All')}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 bg-background border">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
            {t('All High Risk')}
          </TabsTrigger>
          <TabsTrigger value="critical" className="data-[state=active]:bg-primary/10">
            {t('Critical')} ({stats.critical})
          </TabsTrigger>
          <TabsTrigger value="flagged" className="data-[state=active]:bg-primary/10">
            {t('Flagged')}
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-primary/10">
            {t('Under Review')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card className="shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <AdminIcons.RiskAlerts className="mr-2 h-5 w-5 text-primary" />
                    {t('High Risk DPRs')}
                  </CardTitle>
                  <CardDescription>
                    {t('DPRs with risk score above {{threshold}}%', { threshold: (parseFloat(riskThreshold) * 100).toFixed(0) })}
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('Search DPRs...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 w-full"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('Sort by')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="risk-desc">{t('Highest Risk First')}</SelectItem>
                      <SelectItem value="risk-asc">{t('Lowest Risk First')}</SelectItem>
                      <SelectItem value="date-desc">{t('Newest First')}</SelectItem>
                      <SelectItem value="date-asc">{t('Oldest First')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>{t('DPR ID')}</TableHead>
                    <TableHead>{t('Title')}</TableHead>
                    <TableHead>{t('Uploaded By')}</TableHead>
                    <TableHead>{t('Upload Date')}</TableHead>
                    <TableHead>{t('Risk Score')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                    <TableHead className="text-right">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDprs.length > 0 ? (
                    filteredDprs.map((dpr) => (
                      <TableRow key={dpr.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{dpr.id}</TableCell>
                        <TableCell>{dpr.title}</TableCell>
                        <TableCell>{dpr.uploaderName || 'Unknown'}</TableCell>
                        <TableCell>{formatDate(dpr.uploadDate)}</TableCell>
                        <TableCell>{getRiskBadge(dpr.riskScore)}</TableCell>
                        <TableCell>{getStatusBadge(dpr.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('View Details')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchTerm 
                          ? t('No DPRs match your search criteria')
                          : t('No high risk DPRs found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 bg-muted/30 flex justify-between">
              <div className="text-sm text-muted-foreground">
                {t('Showing {{count}} high risk DPRs', { count: filteredDprs.length })}
              </div>
              <Button variant="outline" size="sm">
                {t('Export Data')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="critical">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertOctagon className="mr-2 h-5 w-5 text-red-500" />
                {t('Critical Risk DPRs')}
              </CardTitle>
              <CardDescription>
                {t('DPRs with risk score above 90% requiring immediate attention')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>{t('DPR ID')}</TableHead>
                    <TableHead>{t('Title')}</TableHead>
                    <TableHead>{t('Risk Score')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                    <TableHead>{t('Risk Factors')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDprs.filter(dpr => dpr.riskScore >= 0.9).map((dpr) => (
                    <TableRow key={dpr.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{dpr.id}</TableCell>
                      <TableCell>{dpr.title}</TableCell>
                      <TableCell>{getRiskBadge(dpr.riskScore)}</TableCell>
                      <TableCell>{getStatusBadge(dpr.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {dpr.riskFactors?.map((factor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{factor}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>{t('Flagged DPRs')}</CardTitle>
              <CardDescription>
                {t('DPRs that have been flagged for review')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('DPR ID')}</TableHead>
                    <TableHead>{t('Title')}</TableHead>
                    <TableHead>{t('Risk Score')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDprs.filter(dpr => dpr.status === 'Flagged').map((dpr) => (
                    <TableRow key={dpr.id}>
                      <TableCell className="font-medium">{dpr.id}</TableCell>
                      <TableCell>{dpr.title}</TableCell>
                      <TableCell>{getRiskBadge(dpr.riskScore)}</TableCell>
                      <TableCell>{getStatusBadge(dpr.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>{t('DPRs Under Review')}</CardTitle>
              <CardDescription>
                {t('High risk DPRs currently being reviewed')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('DPR ID')}</TableHead>
                    <TableHead>{t('Title')}</TableHead>
                    <TableHead>{t('Risk Score')}</TableHead>
                    <TableHead>{t('Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDprs.filter(dpr => dpr.status === 'Under Review').map((dpr) => (
                    <TableRow key={dpr.id}>
                      <TableCell className="font-medium">{dpr.id}</TableCell>
                      <TableCell>{dpr.title}</TableCell>
                      <TableCell>{getRiskBadge(dpr.riskScore)}</TableCell>
                      <TableCell>{getStatusBadge(dpr.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
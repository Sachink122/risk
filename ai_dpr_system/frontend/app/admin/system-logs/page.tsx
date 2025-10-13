'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AdminIcons } from '@/components/admin-icons';
import { Search, AlertCircle, Clock, ArrowDown, FileDown, Eye, Filter } from 'lucide-react';

export default function SystemLogsPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [logLevel, setLogLevel] = React.useState('all');
  const [timeRange, setTimeRange] = React.useState('24h');

  React.useEffect(() => {
    // Generate demo system logs
    const demoLogs = [
      {
        id: 'log-001',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        level: 'info',
        source: 'api.user',
        message: 'User login successful',
        details: 'User ID: 12345, IP: 192.168.1.1',
      },
      {
        id: 'log-002',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        level: 'warning',
        source: 'ml.risk',
        message: 'Risk prediction model performance degradation detected',
        details: 'Accuracy dropped by 5% in last 100 predictions',
      },
      {
        id: 'log-003',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        level: 'error',
        source: 'api.documents',
        message: 'Document processing failed',
        details: 'File ID: DOC78901, Error: Invalid file format',
      },
      {
        id: 'log-004',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        source: 'system.backup',
        message: 'Daily backup completed successfully',
        details: 'Backup size: 2.4 GB, Duration: 5m 23s',
      },
      {
        id: 'log-005',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        level: 'debug',
        source: 'ml.ocr',
        message: 'OCR processing completed for batch',
        details: 'Batch ID: OCR-456, 12 documents processed',
      },
      {
        id: 'log-006',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        level: 'critical',
        source: 'system.database',
        message: 'Database connection timeout',
        details: 'Connection pool exhausted, retry attempt #3 succeeded',
      },
      {
        id: 'log-007',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        level: 'error',
        source: 'auth.service',
        message: 'Multiple failed login attempts detected',
        details: 'User ID: 34567, IP: 203.0.113.42, Attempts: 5',
      },
      {
        id: 'log-008',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        level: 'info',
        source: 'system.update',
        message: 'System updated to version 2.3.4',
        details: 'Update duration: 3m 12s, Services restarted',
      }
    ];
    
    setLogs(demoLogs);
  }, []);

  const filteredLogs = React.useMemo(() => {
    let filtered = [...logs];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by log level
    if (logLevel !== 'all') {
      filtered = filtered.filter(log => log.level === logLevel);
    }
    
    // Filter by time range
    const now = Date.now();
    let timeLimit: number;
    
    switch (timeRange) {
      case '1h':
        timeLimit = now - 1 * 60 * 60 * 1000;
        break;
      case '6h':
        timeLimit = now - 6 * 60 * 60 * 1000;
        break;
      case '24h':
        timeLimit = now - 24 * 60 * 60 * 1000;
        break;
      case '7d':
        timeLimit = now - 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        timeLimit = 0;
    }
    
    if (timeLimit > 0) {
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() > timeLimit);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return filtered;
  }, [logs, searchTerm, logLevel, timeRange]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getLogLevelBadge = (level: string) => {
    switch(level) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">{level}</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">{level}</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">{level}</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">{level}</Badge>;
      case 'debug':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('System Logs')}</h2>
          <p className="text-muted-foreground">{t('Monitor system activity and troubleshoot issues')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            {t('Live Logs')}
          </Button>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            {t('Export Logs')}
          </Button>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <AdminIcons.Database className="mr-2 h-5 w-5 text-primary" />
                {t('System Logs')}
              </CardTitle>
              <CardDescription>
                {t('Recent system events and activities')}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search logs...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder={t('Log Level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All Levels')}</SelectItem>
                    <SelectItem value="critical">{t('Critical')}</SelectItem>
                    <SelectItem value="error">{t('Error')}</SelectItem>
                    <SelectItem value="warning">{t('Warning')}</SelectItem>
                    <SelectItem value="info">{t('Info')}</SelectItem>
                    <SelectItem value="debug">{t('Debug')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder={t('Time Range')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">{t('Last hour')}</SelectItem>
                    <SelectItem value="6h">{t('Last 6 hours')}</SelectItem>
                    <SelectItem value="24h">{t('Last 24 hours')}</SelectItem>
                    <SelectItem value="7d">{t('Last 7 days')}</SelectItem>
                    <SelectItem value="all">{t('All time')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="px-4 pt-2 bg-background">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                {t('All')}
              </TabsTrigger>
              <TabsTrigger value="errors" className="data-[state=active]:bg-primary/10">
                {t('Errors')}
              </TabsTrigger>
              <TabsTrigger value="warnings" className="data-[state=active]:bg-primary/10">
                {t('Warnings')}
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-primary/10">
                {t('System')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">{t('Timestamp')}</TableHead>
                    <TableHead className="w-[100px]">{t('Level')}</TableHead>
                    <TableHead className="w-[120px]">{t('Source')}</TableHead>
                    <TableHead>{t('Message')}</TableHead>
                    <TableHead className="text-right w-[80px]">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.source}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('View Details')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {searchTerm || logLevel !== 'all' || timeRange !== 'all'
                          ? t('No logs match your search criteria')
                          : t('No system logs found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="errors" className="m-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">{t('Timestamp')}</TableHead>
                    <TableHead className="w-[100px]">{t('Level')}</TableHead>
                    <TableHead className="w-[120px]">{t('Source')}</TableHead>
                    <TableHead>{t('Message')}</TableHead>
                    <TableHead className="text-right w-[80px]">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.filter(log => log.level === 'error' || log.level === 'critical').length > 0 ? (
                    filteredLogs.filter(log => log.level === 'error' || log.level === 'critical').map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.source}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('View Details')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {t('No error logs found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="warnings" className="m-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">{t('Timestamp')}</TableHead>
                    <TableHead className="w-[100px]">{t('Level')}</TableHead>
                    <TableHead className="w-[120px]">{t('Source')}</TableHead>
                    <TableHead>{t('Message')}</TableHead>
                    <TableHead className="text-right w-[80px]">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.filter(log => log.level === 'warning').length > 0 ? (
                    filteredLogs.filter(log => log.level === 'warning').map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.source}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('View Details')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {t('No warning logs found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">{t('Timestamp')}</TableHead>
                    <TableHead className="w-[100px]">{t('Level')}</TableHead>
                    <TableHead className="w-[120px]">{t('Source')}</TableHead>
                    <TableHead>{t('Message')}</TableHead>
                    <TableHead className="text-right w-[80px]">{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.filter(log => log.source.startsWith('system')).length > 0 ? (
                    filteredLogs.filter(log => log.source.startsWith('system')).map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.source}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={t('View Details')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {t('No system logs found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
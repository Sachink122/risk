'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { AdminIcons } from '@/components/admin-icons';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

export default function MonitoringPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = React.useState('24h');
  const [refreshInterval, setRefreshInterval] = React.useState('0');
  const [lastRefreshed, setLastRefreshed] = React.useState<Date>(new Date());

  // Mock system metrics
  const [metrics, setMetrics] = React.useState({
    cpu: {
      current: 32,
      history: [28, 35, 42, 37, 29, 30, 32, 38, 41, 43, 40, 35, 32],
      trend: 'stable'
    },
    memory: {
      current: 67,
      history: [62, 65, 67, 68, 70, 72, 69, 68, 66, 65, 67, 68, 67],
      trend: 'stable'
    },
    storage: {
      current: 54,
      history: [40, 42, 45, 46, 48, 50, 51, 52, 53, 53, 54, 54, 54],
      trend: 'increasing'
    },
    api: {
      requestsPerMinute: 387,
      avgResponseTime: 245,
      errorRate: 0.4,
      history: [320, 340, 360, 390, 410, 380, 370, 350, 340, 380, 390, 400, 387],
      trend: 'increasing'
    },
    users: {
      activeNow: 124,
      history: [80, 95, 105, 115, 130, 142, 138, 125, 115, 110, 118, 125, 124],
      trend: 'stable'
    },
    predictions: {
      totalToday: 1342,
      avgAccuracy: 92.4,
      history: [800, 950, 1050, 1100, 1200, 1240, 1280, 1300, 1320, 1330, 1335, 1340, 1342],
      trend: 'stable'
    }
  });

  // Set up periodic refresh if interval is set
  React.useEffect(() => {
    if (refreshInterval === '0') return;
    
    const interval = parseInt(refreshInterval) * 1000;
    const timer = setInterval(() => {
      // Simulate data refresh
      setLastRefreshed(new Date());
      
      // Update metrics with slight random variations
      setMetrics(prev => {
        const variation = (base: number, max: number = 5) => base + (Math.random() * max * 2 - max);
        
        return {
          ...prev,
          cpu: {
            ...prev.cpu,
            current: Math.min(100, Math.max(5, Math.round(variation(prev.cpu.current)))),
            history: [...prev.cpu.history.slice(1), Math.round(variation(prev.cpu.current))]
          },
          memory: {
            ...prev.memory,
            current: Math.min(100, Math.max(10, Math.round(variation(prev.memory.current, 2)))),
            history: [...prev.memory.history.slice(1), Math.round(variation(prev.memory.current, 2))]
          },
          api: {
            ...prev.api,
            requestsPerMinute: Math.max(10, Math.round(variation(prev.api.requestsPerMinute, 20))),
            avgResponseTime: Math.max(50, Math.round(variation(prev.api.avgResponseTime, 15))),
            errorRate: Math.max(0, parseFloat(variation(prev.api.errorRate, 0.2).toFixed(1))),
            history: [...prev.api.history.slice(1), Math.round(variation(prev.api.requestsPerMinute, 20))]
          },
          users: {
            ...prev.users,
            activeNow: Math.max(5, Math.round(variation(prev.users.activeNow, 8))),
            history: [...prev.users.history.slice(1), Math.round(variation(prev.users.activeNow, 8))]
          }
        };
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [refreshInterval]);

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    // Would normally fetch new data here
  };

  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Helper to create trend indicator
  const getTrendIndicator = (trend: string) => {
    if (trend === 'increasing') {
      return <span className="text-green-500 flex items-center"><ArrowUp className="h-3.5 w-3.5 mr-1" /> {t('Increasing')}</span>;
    } else if (trend === 'decreasing') {
      return <span className="text-red-500 flex items-center"><ArrowDown className="h-3.5 w-3.5 mr-1" /> {t('Decreasing')}</span>;
    }
    return <span className="text-blue-500">{t('Stable')}</span>;
  };

  // Simple gauge/progress component
  const Gauge = ({ value, color = 'blue', size = 'default' }: { value: number, color?: string, size?: 'small' | 'default' }) => {
    let colorClass = '';
    if (value < 60) colorClass = 'bg-blue-500';
    else if (value < 80) colorClass = 'bg-amber-500';
    else colorClass = 'bg-red-500';
    
    const height = size === 'small' ? 'h-2' : 'h-3';
    
    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height}`}>
        <div 
          className={`${colorClass} ${height} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('System Monitoring')}</h2>
          <p className="text-muted-foreground">
            {t('Monitor system performance metrics')}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('Auto-refresh')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t('Manual refresh')}</SelectItem>
              <SelectItem value="5">{t('Every 5 seconds')}</SelectItem>
              <SelectItem value="15">{t('Every 15 seconds')}</SelectItem>
              <SelectItem value="30">{t('Every 30 seconds')}</SelectItem>
              <SelectItem value="60">{t('Every minute')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('Refresh')}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {t('Last updated')}: {formatLastRefreshed()}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
            {t('Overview')}
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-primary/10">
            {t('Resources')}
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-primary/10">
            {t('API')}
          </TabsTrigger>
          <TabsTrigger value="ml" className="data-[state=active]:bg-primary/10">
            {t('ML Pipeline')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* System Overview */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.Analytics className="mr-2 h-4 w-4 text-blue-500" />
                  {t('CPU Usage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.cpu.current}%</div>
                <Gauge value={metrics.cpu.current} />
                <div className="text-xs mt-2">
                  {getTrendIndicator(metrics.cpu.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.Analytics className="mr-2 h-4 w-4 text-purple-500" />
                  {t('Memory Usage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.memory.current}%</div>
                <Gauge value={metrics.memory.current} />
                <div className="text-xs mt-2">
                  {getTrendIndicator(metrics.memory.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.Database className="mr-2 h-4 w-4 text-amber-500" />
                  {t('Storage Usage')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.storage.current}%</div>
                <Gauge value={metrics.storage.current} />
                <div className="text-xs mt-2">
                  {getTrendIndicator(metrics.storage.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.Analytics className="mr-2 h-4 w-4 text-green-500" />
                  {t('API Requests')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.api.requestsPerMinute} <span className="text-sm font-normal text-muted-foreground">{t('req/min')}</span></div>
                <div className="flex items-center text-sm mt-1">
                  <span className="text-muted-foreground">{t('Avg. Response')}:</span>
                  <span className="ml-2">{metrics.api.avgResponseTime} ms</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <span className="text-muted-foreground">{t('Error Rate')}:</span>
                  <span className={`ml-2 ${metrics.api.errorRate > 1 ? 'text-red-500' : ''}`}>
                    {metrics.api.errorRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.Users className="mr-2 h-4 w-4 text-blue-500" />
                  {t('Active Users')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.users.activeNow}</div>
                <div className="text-xs mt-2">
                  {getTrendIndicator(metrics.users.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AdminIcons.RiskAlerts className="mr-2 h-4 w-4 text-indigo-500" />
                  {t('Risk Predictions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.predictions.totalToday}</div>
                <div className="flex items-center text-sm mt-1">
                  <span className="text-muted-foreground">{t('Accuracy')}:</span>
                  <span className="ml-2">{metrics.predictions.avgAccuracy}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('System Health')}</CardTitle>
              <CardDescription>
                {t('All system services are currently operational')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>{t('API Services')}</span>
                  </div>
                  <span className="text-green-500">{t('Operational')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>{t('Database')}</span>
                  </div>
                  <span className="text-green-500">{t('Operational')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>{t('ML Services')}</span>
                  </div>
                  <span className="text-green-500">{t('Operational')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>{t('Storage')}</span>
                  </div>
                  <span className="text-green-500">{t('Operational')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>{t('OCR Services')}</span>
                  </div>
                  <span className="text-amber-500">{t('Degraded Performance')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 bg-muted/30 flex justify-between">
              <div className="text-xs text-muted-foreground">
                {t('Last service check')}: 2 {t('minutes ago')}
              </div>
              <Button variant="outline" size="sm">
                {t('View Service Status')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>{t('System Resources')}</CardTitle>
              <CardDescription>
                {t('Detailed monitoring of system resource usage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{t('CPU Usage')}</h3>
                    <span className="text-sm">{metrics.cpu.current}%</span>
                  </div>
                  <Gauge value={metrics.cpu.current} />
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('Core 1')}</p>
                        <p className="font-medium">38%</p>
                        <Gauge value={38} size="small" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('Core 2')}</p>
                        <p className="font-medium">42%</p>
                        <Gauge value={42} size="small" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('Core 3')}</p>
                        <p className="font-medium">28%</p>
                        <Gauge value={28} size="small" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('Core 4')}</p>
                        <p className="font-medium">35%</p>
                        <Gauge value={35} size="small" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{t('Memory Usage')}</h3>
                    <span className="text-sm">{metrics.memory.current}%</span>
                  </div>
                  <Gauge value={metrics.memory.current} />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-muted-foreground text-sm">{t('Used Memory')}</p>
                      <p className="font-medium">5.4 GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{t('Free Memory')}</p>
                      <p className="font-medium">2.6 GB</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">{t('Storage Usage')}</h3>
                    <span className="text-sm">{metrics.storage.current}%</span>
                  </div>
                  <Gauge value={metrics.storage.current} />
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-muted-foreground text-sm">{t('Total')}</p>
                      <p className="font-medium">500 GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{t('Used')}</p>
                      <p className="font-medium">270 GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{t('Free')}</p>
                      <p className="font-medium">230 GB</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>{t('API Performance')}</CardTitle>
              <CardDescription>
                {t('Monitoring of API endpoints and performance metrics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('Request Rate')}</h3>
                    <p className="text-2xl font-bold">{metrics.api.requestsPerMinute} <span className="text-sm font-normal text-muted-foreground">{t('req/min')}</span></p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('Avg Response Time')}</h3>
                    <p className="text-2xl font-bold">{metrics.api.avgResponseTime} <span className="text-sm font-normal text-muted-foreground">ms</span></p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('Error Rate')}</h3>
                    <p className="text-2xl font-bold">{metrics.api.errorRate}%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('Uptime')}</h3>
                    <p className="text-2xl font-bold">99.98%</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-2">{t('Top API Endpoints')}</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium text-muted-foreground py-2">{t('Endpoint')}</th>
                        <th className="text-right font-medium text-muted-foreground py-2">{t('Requests')}</th>
                        <th className="text-right font-medium text-muted-foreground py-2">{t('Avg Time')}</th>
                        <th className="text-right font-medium text-muted-foreground py-2">{t('Error %')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-mono text-xs">/api/v1/auth/login</td>
                        <td className="text-right py-2">245</td>
                        <td className="text-right py-2">120ms</td>
                        <td className="text-right py-2">0.1%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-mono text-xs">/api/v1/documents/upload</td>
                        <td className="text-right py-2">187</td>
                        <td className="text-right py-2">450ms</td>
                        <td className="text-right py-2">0.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-mono text-xs">/api/v1/risk/predict</td>
                        <td className="text-right py-2">142</td>
                        <td className="text-right py-2">850ms</td>
                        <td className="text-right py-2">1.2%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-mono text-xs">/api/v1/users/profile</td>
                        <td className="text-right py-2">128</td>
                        <td className="text-right py-2">95ms</td>
                        <td className="text-right py-2">0.0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-mono text-xs">/api/v1/documents/list</td>
                        <td className="text-right py-2">104</td>
                        <td className="text-right py-2">145ms</td>
                        <td className="text-right py-2">0.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ml">
          <Card>
            <CardHeader>
              <CardTitle>{t('ML Pipeline')}</CardTitle>
              <CardDescription>
                {t('Machine learning model performance and processing metrics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('Risk Model Accuracy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.4%</div>
                    <div className="text-sm text-green-600 mt-1">+0.8% {t('since last update')}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {t('Based on validation dataset')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('OCR Accuracy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89.7%</div>
                    <div className="text-sm text-amber-600 mt-1">-1.2% {t('since last update')}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {t('Performance degradation detected')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('Processing Time')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-sm text-green-600 mt-1">{t('Optimal')}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {t('Average per document')}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">{t('Model Performance by Type')}</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground py-2">{t('Model')}</th>
                      <th className="text-right font-medium text-muted-foreground py-2">{t('Accuracy')}</th>
                      <th className="text-right font-medium text-muted-foreground py-2">{t('Precision')}</th>
                      <th className="text-right font-medium text-muted-foreground py-2">{t('Recall')}</th>
                      <th className="text-right font-medium text-muted-foreground py-2">{t('F1 Score')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">{t('Risk Analysis')}</td>
                      <td className="text-right py-2">92.4%</td>
                      <td className="text-right py-2">94.1%</td>
                      <td className="text-right py-2">90.8%</td>
                      <td className="text-right py-2">92.4%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">{t('Document Classification')}</td>
                      <td className="text-right py-2">96.2%</td>
                      <td className="text-right py-2">95.7%</td>
                      <td className="text-right py-2">96.8%</td>
                      <td className="text-right py-2">96.3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">{t('OCR Engine')}</td>
                      <td className="text-right py-2">89.7%</td>
                      <td className="text-right py-2">88.2%</td>
                      <td className="text-right py-2">91.5%</td>
                      <td className="text-right py-2">89.8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">{t('Data Extraction')}</td>
                      <td className="text-right py-2">93.5%</td>
                      <td className="text-right py-2">92.8%</td>
                      <td className="text-right py-2">94.3%</td>
                      <td className="text-right py-2">93.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 bg-muted/30 flex justify-between">
              <div className="text-xs text-muted-foreground">
                {t('Last model update')}: {t('Today at')} 09:45 AM
              </div>
              <Button variant="outline" size="sm">
                {t('View ML Logs')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
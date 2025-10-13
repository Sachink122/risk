'use client'

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart2, LineChart, PieChart, ArrowUpIcon, TrendingUp, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function ReportsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('reports.title', 'Reports & Analytics')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/reports/history">
              <Clock className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports/export">
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/reports/download">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/reports/generate">
              <BarChart2 className="mr-2 h-4 w-4" />
              Generate New Report
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('reports.tabs.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="project">{t('reports.tabs.project', 'Project Analysis')}</TabsTrigger>
          <TabsTrigger value="risk">{t('reports.tabs.risk', 'Risk Analysis')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('reports.totalProjects', 'Total Projects')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="ml-1">{t('reports.fromLastMonth', 'from last month')}</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('reports.averageRisk', 'Average Risk Score')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.5%</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-500 font-medium">{t('reports.moderate', 'Moderate')}</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('reports.completedAssessments', 'Completed Assessments')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-blue-500 font-medium">72%</span>
                  <span className="ml-1">{t('reports.completion', 'completion rate')}</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.projectTrends', 'Project Trends')}</CardTitle>
              <CardDescription>
                {t('reports.projectTrendsDesc', 'Project submissions and risk assessments over time')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <BarChart2 className="h-16 w-16" />
                <p className="mt-2">{t('reports.chartPlaceholder', 'Chart visualization will appear here')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="project" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.projectByType', 'Projects by Type')}</CardTitle>
              <CardDescription>
                {t('reports.projectByTypeDesc', 'Distribution of projects across different categories')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <PieChart className="h-16 w-16" />
                <p className="mt-2">{t('reports.chartPlaceholder', 'Chart visualization will appear here')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.riskDistribution', 'Risk Distribution')}</CardTitle>
              <CardDescription>
                {t('reports.riskDistributionDesc', 'Distribution of risk scores across all projects')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <LineChart className="h-16 w-16" />
                <p className="mt-2">{t('reports.chartPlaceholder', 'Chart visualization will appear here')}</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t('reports.download', 'Download Report')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
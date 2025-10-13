'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'

interface RiskIndicatorProps {
  value: number
  title: string
  description?: string
}

export function RiskIndicator({ value, title, description }: RiskIndicatorProps) {
  const getRiskColor = (score: number) => {
    if (score <= 33) return 'bg-green-500'
    if (score <= 66) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getRiskLabel = (score: number) => {
    if (score <= 33) return 'Low Risk'
    if (score <= 66) return 'Medium Risk'
    return 'High Risk'
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <span className="text-xl font-bold">{value}%</span>
      </div>
      
      <Progress value={value} className={`h-3 ${getRiskColor(value)}`} />
      
      <div className="flex justify-between items-center text-sm">
        <span>0%</span>
        <span className="font-semibold">{getRiskLabel(value)}</span>
        <span>100%</span>
      </div>
    </div>
  )
}

interface RiskFactorCardProps {
  title: string
  value: number
  children?: ReactNode
  onViewDetails?: () => void
}

export function RiskFactorCard({ title, value, children, onViewDetails }: RiskFactorCardProps) {
  const getRiskColor = (score: number) => {
    if (score <= 33) return 'text-green-600 dark:text-green-400'
    if (score <= 66) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }
  
  const getRiskLevel = (score: number) => {
    if (score <= 33) return 'Low'
    if (score <= 66) return 'Medium'
    return 'High'
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className={`text-xl font-bold ${getRiskColor(value)}`}>
            {getRiskLevel(value)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <Progress value={value} className={`h-2 ${value <= 33 ? 'bg-green-500' : value <= 66 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

interface RiskMitigationItemProps {
  title: string
  description: string
}

export function RiskMitigationItem({ title, description }: RiskMitigationItemProps) {
  return (
    <div className="py-3">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <Separator className="mt-3" />
    </div>
  )
}

interface ComparativeRiskProps {
  projectName: string
  riskScore: number
}

export function ComparativeRisk({ projectName, riskScore }: ComparativeRiskProps) {
  const getRiskColor = (score: number) => {
    if (score <= 33) return 'bg-green-500'
    if (score <= 66) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm truncate pr-2" title={projectName}>{projectName}</span>
        <span className="text-sm font-medium">{riskScore}%</span>
      </div>
      <Progress value={riskScore} className={`h-2 ${getRiskColor(riskScore)}`} />
    </div>
  )
}
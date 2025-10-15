'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type RiskFactor = {
  category: string;
  score: number;
  description: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
  keyIndicators: string[];
};

type RiskAnalysis = {
  id: string | number;
  projectTitle: string;
  projectCode: string;
  overallRiskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  summary: string;
  riskFactors: RiskFactor[];
  recommendations: string[];
};

export default function RiskAnalysis({ params }: { params: { id: string } }) {
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    try {
      // Get DPR from localStorage
      const storedDprs = JSON.parse(localStorage.getItem('uploaded-dprs') || '[]')
      const dpr = storedDprs.find((item: any) => item.id.toString() === params.id)
      
      if (dpr && dpr.status === 'Evaluated') {
        // Generate risk analysis data based on the DPR's risk level
        const analysis: RiskAnalysis = {
          id: dpr.id,
          projectTitle: dpr.title,
          projectCode: dpr.projectCode,
          overallRiskScore: dpr.riskLevel === 'High' ? Math.floor(Math.random() * 15) + 40 : 
                           dpr.riskLevel === 'Medium' ? Math.floor(Math.random() * 15) + 60 : 
                           Math.floor(Math.random() * 15) + 80,
          riskLevel: dpr.riskLevel,
          summary: dpr.riskLevel === 'High' 
            ? `The project presents significant risks that require immediate attention. Major concerns include budget overestimations, timeline inconsistencies, and compliance issues. Without proper mitigation strategies, these risks could jeopardize the successful implementation of the project.`
            : dpr.riskLevel === 'Medium'
            ? `The project presents moderate risks primarily in the areas of resource allocation and timeline planning. While most risk factors are manageable with proper mitigation strategies, special attention should be given to resource optimization and timeline adjustments.`
            : `The project presents minimal risks and is well-planned overall. The DPR documentation is comprehensive with appropriate attention to detail. Regular monitoring is recommended to maintain the low-risk status throughout the implementation phase.`,
          riskFactors: [],
          recommendations: []
        };
        
        // Generate risk factors based on risk level
        if (dpr.riskLevel === 'High') {
          analysis.riskFactors = [
            {
              category: 'Financial',
              score: Math.floor(Math.random() * 15) + 30,
              description: 'Budget overestimation and lack of detailed breakdown',
              probability: 'High',
              impact: 'High',
              mitigation: 'Complete budget reassessment with detailed itemization',
              keyIndicators: [
                'Cost estimates exceed benchmarks by 25%',
                'Inadequate breakdown of major cost components',
                'Missing contingency allocations'
              ]
            },
            {
              category: 'Timeline',
              score: Math.floor(Math.random() * 15) + 35,
              description: 'Unrealistic implementation schedule',
              probability: 'High',
              impact: 'Medium',
              mitigation: 'Develop a more realistic timeline with buffer periods',
              keyIndicators: [
                'Critical path analysis shows timeline underestimation',
                'Resource allocation conflicts detected',
                'Seasonal constraints not adequately addressed'
              ]
            },
            {
              category: 'Compliance',
              score: Math.floor(Math.random() * 15) + 40,
              description: 'Missing regulatory compliance details',
              probability: 'Medium',
              impact: 'High',
              mitigation: 'Conduct thorough regulatory review and address gaps',
              keyIndicators: [
                'Several key regulatory requirements not addressed',
                'Missing environmental clearance documentation',
                'Inadequate stakeholder consultation evidence'
              ]
            }
          ];
          
          analysis.recommendations = [
            'Conduct comprehensive budget revision with detailed itemization',
            'Extend implementation timeline by 25% with proper buffer periods',
            'Complete regulatory compliance assessment and address all gaps',
            'Implement enhanced project governance and oversight mechanisms',
            'Develop detailed risk mitigation plan for each identified risk factor'
          ];
        } else if (dpr.riskLevel === 'Medium') {
          analysis.riskFactors = [
            {
              category: 'Resource',
              score: Math.floor(Math.random() * 15) + 55,
              description: 'Suboptimal resource allocation',
              probability: 'Medium',
              impact: 'Medium',
              mitigation: 'Review and optimize resource allocation plan',
              keyIndicators: [
                'Resource allocation inefficiencies detected',
                'Some skill gaps in proposed team structure',
                'Potential for resource optimization'
              ]
            },
            {
              category: 'Timeline',
              score: Math.floor(Math.random() * 15) + 60,
              description: 'Minor timeline inconsistencies',
              probability: 'Medium',
              impact: 'Low',
              mitigation: 'Adjust timeline to address inconsistencies',
              keyIndicators: [
                'Some timeline inconsistencies in non-critical activities',
                'Minor sequencing issues in task dependencies',
                'Limited buffer time for unexpected delays'
              ]
            },
            {
              category: 'Technical',
              score: Math.floor(Math.random() * 15) + 65,
              description: 'Technical specifications need enhancement',
              probability: 'Low',
              impact: 'Medium',
              mitigation: 'Enhance technical specifications and requirements',
              keyIndicators: [
                'Some technical specifications need more detail',
                'Technology choices generally appropriate but could be optimized',
                'Maintenance considerations adequately addressed'
              ]
            }
          ];
          
          analysis.recommendations = [
            'Review and optimize resource allocation across project phases',
            'Address timeline inconsistencies with appropriate adjustments',
            'Enhance technical specifications where identified',
            'Implement regular project progress reviews',
            'Develop contingency plans for identified medium-risk areas'
          ];
        } else {
          analysis.riskFactors = [
            {
              category: 'General',
              score: Math.floor(Math.random() * 10) + 85,
              description: 'No significant issues detected',
              probability: 'Low',
              impact: 'Low',
              mitigation: 'Continue with regular monitoring and reporting',
              keyIndicators: [
                'Project documentation is comprehensive',
                'Risk assessment is thorough',
                'Contingency plans are appropriate'
              ]
            },
            {
              category: 'Implementation',
              score: Math.floor(Math.random() * 10) + 80,
              description: 'Minor implementation considerations',
              probability: 'Low',
              impact: 'Low',
              mitigation: 'Maintain regular progress monitoring',
              keyIndicators: [
                'Implementation plan is well-structured',
                'Resource allocation is appropriate',
                'Timeline is realistic and achievable'
              ]
            }
          ];
          
          analysis.recommendations = [
            'Continue with proposed implementation plan',
            'Maintain regular monitoring and reporting mechanisms',
            'Document best practices for future reference',
            'Consider minor optimizations as implementation progresses',
            'Ensure knowledge transfer for sustainable operations'
          ];
        }
        
        setRiskAnalysis(analysis);
      } else {
        toast({
          title: "DPR not found or not evaluated",
          description: "The requested DPR could not be found or has not been evaluated yet",
          variant: "destructive"
        });
        router.push('/dprs');
      }
    } catch (error) {
      console.error("Error loading DPR:", error);
      toast({
        title: "Error",
        description: "Failed to load risk analysis data",
        variant: "destructive"
      });
      router.push('/dprs');
    } finally {
      setLoading(false);
    }
  }, [params.id, router, toast]);

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRiskLevelBadgeClass = (level: string) => {
    switch(level) {
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
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading risk analysis data...</p>
      </div>
    )
  }

  if (!riskAnalysis) {
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
                Risk Analysis
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {riskAnalysis.projectCode} - {riskAnalysis.projectTitle}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push(`/dprs/${params.id}`)}>
                Back to DPR
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6">
        <div className="container mx-auto max-w-5xl">
          {/* Risk Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Risk Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                          strokeDasharray="100, 100"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={riskAnalysis.overallRiskScore >= 80 ? '#10b981' : riskAnalysis.overallRiskScore >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="3"
                          strokeDasharray={`${riskAnalysis.overallRiskScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold">{riskAnalysis.overallRiskScore}</span>
                        <span className="text-sm text-slate-500">Risk Score</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getRiskLevelBadgeClass(riskAnalysis.riskLevel)}`}>
                        {riskAnalysis.riskLevel} Risk Level
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-2">Risk Summary</h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    {riskAnalysis.summary}
                  </p>
                  
                  <h3 className="text-lg font-medium mb-2">Key Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {riskAnalysis.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {riskAnalysis.riskFactors.map((factor, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <h3 className="text-lg font-semibold">{factor.category} Risk</h3>
                        <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          factor.score >= 80 ? 'bg-green-100 text-green-800' :
                          factor.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {factor.score}/100
                        </span>
                      </div>
                      
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <div className="text-xs text-slate-500">Probability</div>
                          <div className={`mt-1 text-sm font-medium ${
                            factor.probability === 'High' ? 'text-red-600' :
                            factor.probability === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {factor.probability}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500">Impact</div>
                          <div className={`mt-1 text-sm font-medium ${
                            factor.impact === 'High' ? 'text-red-600' :
                            factor.impact === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {factor.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-500 mb-1">Description</div>
                      <p className="text-slate-700 dark:text-slate-300">{factor.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-500 mb-1">Key Indicators</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        {factor.keyIndicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Recommended Mitigation</div>
                      <p className="text-slate-700 dark:text-slate-300">{factor.mitigation}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center">
                        <div className="text-xs text-slate-500 mr-2">Risk Level:</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={getRiskScoreColor(factor.score)}
                            style={{ width: `${factor.score}%`, height: '100%' }}
                          ></div>
                        </div>
                        <div className="ml-2 text-xs font-semibold">{factor.score}%</div>
                      </div>
                    </div>
                  </div>
                ))}
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
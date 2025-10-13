'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/auth-provider'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const riskFormSchema = z.object({
  projectName: z.string().min(3, { message: 'Project name is required' }),
  projectDescription: z.string().min(10, { message: 'Please provide a more detailed description' }),
  projectCost: z.string().min(1, { message: 'Project cost is required' }),
  projectDuration: z.string().min(1, { message: 'Project duration is required' }),
  projectLocation: z.string().min(2, { message: 'Project location is required' }),
  projectType: z.string().min(1, { message: 'Project type is required' }),
  terrainComplexity: z.string().min(1, { message: 'Terrain complexity is required' }),
  weatherConditions: z.string().min(1, { message: 'Weather conditions are required' }),
});

type RiskFormData = z.infer<typeof riskFormSchema>

export default function RiskPredictionPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [riskFactors, setRiskFactors] = useState<{factor: string, impact: number, mitigation: string}[]>([])
  
  // Debug user information and determine admin status
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    console.log("Current user:", user)
    console.log("Is admin from user object:", user?.is_admin)
    console.log("Auth token:", localStorage.getItem('auth-token'))
    
    // Check if there is a current user in localStorage
    const currentUserStr = localStorage.getItem('current-user')
    console.log("LocalStorage current-user:", currentUserStr)
    
    // Determine admin status from all available sources
    let adminStatus = false
    
    // Check user object from context
    if (user && user.is_admin === true) {
      adminStatus = true
    } 
    
    // Check localStorage as fallback
    if (!adminStatus && currentUserStr) {
      try {
        const storedUser = JSON.parse(currentUserStr)
        if (storedUser && storedUser.is_admin === true) {
          adminStatus = true
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
    }
    
    // Use only user data from localStorage for admin status
    // No additional token checks needed
    
    setIsAdmin(adminStatus)
    console.log("Final admin status determination:", adminStatus)
  }, [user])
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RiskFormData>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
      projectCost: '',
      projectDuration: '',
      projectLocation: '',
      projectType: 'road',
      terrainComplexity: 'medium',
      weatherConditions: 'moderate',
    },
  })
  
  const onSubmit = async (data: RiskFormData) => {
    setIsLoading(true)
    try {
      // Mock API call for risk prediction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockRiskScore = Math.floor(Math.random() * 100);
      setRiskScore(mockRiskScore);
      
      // Generate mock risk factors based on inputs
      const mockRiskFactors = [
        {
          factor: 'Terrain Complexity',
          impact: data.terrainComplexity === 'high' ? 85 : data.terrainComplexity === 'medium' ? 50 : 20,
          mitigation: 'Conduct detailed geological surveys and adjust construction methods accordingly.'
        },
        {
          factor: 'Weather Conditions',
          impact: data.weatherConditions === 'extreme' ? 90 : data.weatherConditions === 'moderate' ? 60 : 30,
          mitigation: 'Implement weather monitoring systems and plan for seasonal work schedules.'
        },
        {
          factor: 'Project Duration',
          impact: parseInt(data.projectDuration) > 36 ? 70 : parseInt(data.projectDuration) > 24 ? 50 : 30,
          mitigation: 'Establish clear milestones and implement aggressive project tracking mechanisms.'
        },
        {
          factor: 'Cost Overrun',
          impact: parseInt(data.projectCost) > 10000000 ? 75 : parseInt(data.projectCost) > 5000000 ? 60 : 40,
          mitigation: 'Create detailed cost estimation and maintain contingency funds of at least 15%.'
        }
      ];
      
      setRiskFactors(mockRiskFactors);
      
      toast({
        title: 'Risk Analysis Complete',
        description: 'Project risk assessment has been completed successfully.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not complete the risk analysis. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  function getRiskColor(score: number) {
    if (score <= 33) return 'bg-green-500'
    if (score <= 66) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  function getRiskLabel(score: number) {
    if (score <= 33) return 'Low Risk'
    if (score <= 66) return 'Medium Risk'
    return 'High Risk'
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Risk Prediction</h1>
        {/* Use our computed isAdmin state which checks multiple sources */}
        {isAdmin && (
          <Button onClick={() => window.location.href = '/dashboard/risk-prediction/advanced'} variant="outline">
            Switch to Advanced Mode
          </Button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Enter your project details for risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="risk-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. NH-37 Road Expansion"
                  {...register('projectName')}
                />
                {errors.projectName && (
                  <p className="text-sm text-red-500">{errors.projectName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select 
                  defaultValue="road" 
                  onValueChange={(value: string) => setValue('projectType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Road Construction</SelectItem>
                    <SelectItem value="bridge">Bridge Construction</SelectItem>
                    <SelectItem value="building">Building Construction</SelectItem>
                    <SelectItem value="dam">Dam Construction</SelectItem>
                    <SelectItem value="railway">Railway Construction</SelectItem>
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-sm text-red-500">{errors.projectType.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Briefly describe the project scope and objectives"
                  rows={4}
                  {...register('projectDescription')}
                />
                {errors.projectDescription && (
                  <p className="text-sm text-red-500">{errors.projectDescription.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectCost">Estimated Cost (₹ in lakhs)</Label>
                  <Input
                    id="projectCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 1000"
                    {...register('projectCost')}
                  />
                  {errors.projectCost && (
                    <p className="text-sm text-red-500">{errors.projectCost.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectDuration">Duration (months)</Label>
                  <Input
                    id="projectDuration"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 24"
                    {...register('projectDuration')}
                  />
                  {errors.projectDuration && (
                    <p className="text-sm text-red-500">{errors.projectDuration.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLocation">Location</Label>
                <Input
                  id="projectLocation"
                  placeholder="e.g. Guwahati, Assam"
                  {...register('projectLocation')}
                />
                {errors.projectLocation && (
                  <p className="text-sm text-red-500">{errors.projectLocation.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="terrainComplexity">Terrain Complexity</Label>
                <Select 
                  defaultValue="medium" 
                  onValueChange={(value: string) => setValue('terrainComplexity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select terrain complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flat terrain, easily accessible</SelectItem>
                    <SelectItem value="medium">Medium - Some hills or challenging areas</SelectItem>
                    <SelectItem value="high">High - Mountainous, difficult terrain</SelectItem>
                  </SelectContent>
                </Select>
                {errors.terrainComplexity && (
                  <p className="text-sm text-red-500">{errors.terrainComplexity.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Select 
                  defaultValue="moderate" 
                  onValueChange={(value: string) => setValue('weatherConditions', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select typical weather conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild - Minimal rain, stable conditions</SelectItem>
                    <SelectItem value="moderate">Moderate - Seasonal variations, predictable patterns</SelectItem>
                    <SelectItem value="extreme">Extreme - Heavy monsoons, flooding potential, landslide prone</SelectItem>
                  </SelectContent>
                </Select>
                {errors.weatherConditions && (
                  <p className="text-sm text-red-500">{errors.weatherConditions.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="risk-form" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing Risks...' : 'Analyze Project Risks'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          {riskScore !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Results</CardTitle>
                <CardDescription>Overall project risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Overall Risk Score</Label>
                    <span className="font-medium">{riskScore}%</span>
                  </div>
                  <Progress value={riskScore} className={getRiskColor(riskScore)} />
                  <div className="text-center font-semibold text-lg">
                    {getRiskLabel(riskScore)}
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="risk-factors">
                    <AccordionTrigger>Risk Factors Analysis</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {riskFactors.map((factor, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{factor.factor}</Label>
                              <span className="font-medium">{factor.impact}%</span>
                            </div>
                            <Progress value={factor.impact} className={getRiskColor(factor.impact)} />
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <span className="font-medium">Mitigation:</span> {factor.mitigation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="recommendations">
                    <AccordionTrigger>Recommendations</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Conduct detailed geological surveys before commencing work.</li>
                        <li>Establish a comprehensive risk management plan with regular review intervals.</li>
                        <li>Allocate appropriate contingency funds based on the risk profile.</li>
                        <li>Implement weather monitoring systems for early warning.</li>
                        <li>Plan for alternative materials and resources in case of supply chain disruptions.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="comparable-projects">
                    <AccordionTrigger>Comparable Projects</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">Similar projects in your region and their risk profiles:</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between">
                            <span>NH-44 Expansion (2021)</span>
                            <span className="font-medium">62%</span>
                          </div>
                          <Progress value={62} className="bg-yellow-500" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Brahmaputra Bridge (2019)</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <Progress value={78} className="bg-red-500" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Guwahati Bypass (2022)</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <Progress value={45} className="bg-yellow-500" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Report Generated',
                      description: 'Detailed risk analysis report has been generated and saved.'
                    })
                  }}
                >
                  Generate Detailed Report
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!riskScore && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Results</CardTitle>
                <CardDescription>Fill the form and click Analyze to see results</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Enter your project details and submit the form to generate a risk assessment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
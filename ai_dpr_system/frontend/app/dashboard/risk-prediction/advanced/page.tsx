'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/auth-provider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface RiskFactor {
  id: string;
  name: string;
  score: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export default function AdvancedRiskPrediction() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('form')
  
  // Determine admin status and redirect non-admin users
  useEffect(() => {
    const checkAdminStatus = () => {
      // Check from user context
      if (user?.is_admin === true) {
        return true
      }
      
      // Check localStorage as fallback
      try {
        const currentUserStr = localStorage.getItem('current-user')
        if (currentUserStr) {
          const storedUser = JSON.parse(currentUserStr)
          if (storedUser && storedUser.is_admin === true) {
            return true
          }
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
      
      // Use only user data from localStorage for admin status
      // No additional token checks needed
      
      return false
    }
    
    const isAdmin = checkAdminStatus()
    console.log("Advanced page - Admin status:", isAdmin)
    
    // Redirect if not admin
    if (!isAdmin) {
      router.push('/dashboard/risk-prediction')
    }
  }, [user, router])
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    cost: '',
    duration: '',
    projectType: '',
    location: '',
    landAcquisitionStatus: '',
    environmentalClearance: false,
    forestClearance: false,
    wildlifeClearance: false,
  })
  
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [overallRiskScore, setOverallRiskScore] = useState(0)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProjectData(prev => ({ ...prev, [id]: value }))
  }
  
  const handleSelectChange = (id: string, value: string) => {
    setProjectData(prev => ({ ...prev, [id]: value }))
  }
  
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setProjectData(prev => ({ ...prev, [id]: checked }))
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock risk assessment results
      const mockRiskFactors: RiskFactor[] = [
        {
          id: 'land',
          name: 'Land Acquisition',
          score: projectData.landAcquisitionStatus === 'completed' ? 10 : 60,
          description: projectData.landAcquisitionStatus === 'completed' 
            ? 'Land acquisition has been completed, minimizing delays and legal issues.' 
            : 'Incomplete land acquisition may lead to project delays and cost overruns.',
          severity: projectData.landAcquisitionStatus === 'completed' ? 'low' : 'high',
          recommendations: [
            'Complete land acquisition before starting construction',
            'Engage with local communities to address concerns',
            'Establish clear compensation frameworks'
          ]
        },
        {
          id: 'env',
          name: 'Environmental Compliance',
          score: projectData.environmentalClearance ? 20 : 70,
          description: projectData.environmentalClearance
            ? 'Environmental clearance has been obtained but ongoing monitoring is required.'
            : 'Missing environmental clearance may lead to legal challenges and work stoppages.',
          severity: projectData.environmentalClearance ? 'low' : 'high',
          recommendations: [
            'Complete environmental impact assessment',
            'Implement mitigation measures',
            'Establish environmental monitoring program'
          ]
        },
        {
          id: 'budget',
          name: 'Budget Risk',
          score: parseInt(projectData.cost) > 10000 ? 50 : 30,
          description: parseInt(projectData.cost) > 10000
            ? 'High-budget projects have greater financial risks and require robust controls.'
            : 'Moderate budget risk with potential for minor cost overruns.',
          severity: parseInt(projectData.cost) > 10000 ? 'medium' : 'low',
          recommendations: [
            'Implement robust cost control mechanisms',
            'Maintain contingency reserves',
            'Regular budget reviews and adjustments'
          ]
        },
        {
          id: 'schedule',
          name: 'Schedule Risk',
          score: parseInt(projectData.duration) > 48 ? 40 : 20,
          description: parseInt(projectData.duration) > 48
            ? 'Long project duration increases vulnerability to delays and external factors.'
            : 'Moderate schedule risk with manageable timeline.',
          severity: parseInt(projectData.duration) > 48 ? 'medium' : 'low',
          recommendations: [
            'Implement critical path monitoring',
            'Develop recovery plans for potential delays',
            'Regular schedule reviews'
          ]
        },
        {
          id: 'regulatory',
          name: 'Regulatory Compliance',
          score: projectData.forestClearance && projectData.wildlifeClearance ? 15 : 55,
          description: projectData.forestClearance && projectData.wildlifeClearance
            ? 'Regulatory clearances obtained, reducing compliance risks.'
            : 'Incomplete regulatory clearances may lead to project halts and penalties.',
          severity: projectData.forestClearance && projectData.wildlifeClearance ? 'low' : 'high',
          recommendations: [
            'Establish regulatory compliance checklist',
            'Regular audits of compliance status',
            'Engagement with regulatory authorities'
          ]
        }
      ]
      
      // Calculate overall risk score (weighted average)
      const totalScore = mockRiskFactors.reduce((sum, factor) => sum + factor.score, 0)
      const calculatedOverallScore = Math.round(totalScore / mockRiskFactors.length)
      
      setRiskFactors(mockRiskFactors)
      setOverallRiskScore(calculatedOverallScore)
      setIsLoading(false)
      setSubmitted(true)
      setActiveTab('results')
    }, 1500)
  }
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]'
      case 'medium': return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]'
      case 'high': return 'bg-[#ffebee] text-[#c62828] border-[#ef9a9a]'
      default: return 'bg-[#f5f5f5] text-[#424242] border-[#e0e0e0]'
    }
  }
  
  const getOverallRiskCategory = (score: number) => {
    if (score < 30) return { category: 'Low Risk', color: 'text-[#2e7d32]', bgColor: 'bg-[#43a047]' }
    if (score < 60) return { category: 'Moderate Risk', color: 'text-[#f57f17]', bgColor: 'bg-[#f9a825]' }
    return { category: 'High Risk', color: 'text-[#c62828]', bgColor: 'bg-[#e53935]' }
  }
  
  const risk = getOverallRiskCategory(overallRiskScore)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f0] to-[#f0f0e8] relative">
      {/* Official watermarks */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="rotate-[-30deg] opacity-[0.03] flex items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Government of India Emblem"
            className="w-[400px] h-[400px]"
          />
        </div>
      </div>
      <div className="fixed top-0 inset-x-0 h-2 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] z-10"></div>
      <div className="fixed bottom-0 inset-x-0 h-2 bg-gradient-to-r from-[#138808] via-[#FFFFFF] to-[#FF9933] z-10"></div>
      
      {/* Prominent official stamp */}
      <div className="fixed top-1/3 right-10 pointer-events-none z-10">
        <div className="rotate-[-20deg]">
          <div className="rounded-full h-32 w-32 border-4 border-[#FF9933] flex items-center justify-center bg-gradient-to-r from-white to-[#f8f8f0] bg-opacity-80 shadow-lg">
            <div className="text-center">
              <div className="text-[#13326f] font-bold text-sm">GOVERNMENT</div>
              <div className="text-[#13326f] font-bold text-sm">OF INDIA</div>
              <div className="text-[#13326f] text-xs mt-1">OFFICIAL USE</div>
              <div className="text-[#13326f] text-xs">ONLY</div>
            </div>
          </div>
        </div>
      </div>
      {/* Government-style header with national emblem and tricolor accent */}
      <div className="bg-gradient-to-r from-[#13326f] via-[#1C4587] to-[#0c225e] text-white shadow-md relative">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD700]"></div>
        <div className="container mx-auto py-6 px-4 md:px-6 flex items-center">
          <div className="h-16 w-16 relative flex-shrink-0 mr-4">
            <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                 style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')" }}>
            </div>
          </div>
          <div className="h-10 w-10 relative flex-shrink-0 mr-4 bg-[#0047AB] rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                 style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg')" }}>
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('risk.advanced.pageTitle', 'Advanced Project Risk Prediction')}</h1>
            <p className="text-gray-200 text-sm md:text-base">{t('risk.advanced.subtitle', 'Comprehensive analysis for infrastructure projects')}</p>
          </div>
        </div>
      </div>
      
      <div className="relative my-4 mx-auto max-w-5xl">
        <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-b from-[#FF9933] to-[#e65100]"></div>
        <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-b from-[#138808] to-[#1b5e20]"></div>
        <div className="absolute top-0 left-4 right-4 h-1 bg-[#FFFFFF]"></div>
        <div className="bg-gradient-to-b from-white to-[#f5f5f0] py-2 px-8 mx-4 text-center border-b-2 border-[#13326f] shadow-md">
          <div className="font-bold text-lg text-[#13326f]">GOVERNMENT OF INDIA</div>
          <div className="text-sm text-[#13326f]">MINISTRY OF INFRASTRUCTURE DEVELOPMENT</div>
          <div className="text-xs text-[#13326f] mt-1">Document Date: October 6, 2025 | Reference: GOI/INFRA/2025/RP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-[#e8e8dc] via-[#f4f4ea] to-[#f0f0e8] border-2 border-[#d0d0c0] shadow-md">
          <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#E05D06] data-[state=active]:text-white font-medium border-r border-[#d0d0c0]">GOI - Project Information</TabsTrigger>
          <TabsTrigger value="results" disabled={!submitted} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#13326f] data-[state=active]:to-[#1C4587] data-[state=active]:text-white font-medium">Risk Assessment Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card className="border-[#d0d0c0] bg-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
            <CardHeader className="border-b border-[#d0d0c0] bg-gradient-to-r from-[#f0f0e8] to-[#f8f8f0]">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-1.5 bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
                <CardTitle>{t('risk.advanced.projectInfoTitle', 'Project Information')} - GOI</CardTitle>
              </div>
              <CardDescription className="mt-2">
                {t('risk.advanced.projectInfoDesc', 'Enter comprehensive details of your infrastructure project for accurate risk assessment')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 border-2 border-[#13326f] rounded-full flex items-center justify-center">
                    <div className="h-16 w-16 border-2 border-[#13326f] rounded-full flex items-center justify-center">
                      <div className="text-[#13326f] text-xs text-center font-medium">
                        <div>GOVERNMENT</div>
                        <div>OF INDIA</div>
                        <div className="text-[8px] mt-1">भारत सरकार</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f8f8f0] border-l-2 border-[#13326f] border-t border-r border-b border-t-[#d0d0c0] border-r-[#d0d0c0] border-b-[#d0d0c0] relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-[#13326f] border-l-[16px] border-l-transparent opacity-30"></div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#13326f] font-medium">{t('risk.form.projectName', 'Project Name')}</Label>
                    <Input 
                      id="name" 
                      value={projectData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. NH-37 Road Expansion" 
                      required 
                      className="border-[#d0d0c0] focus:border-[#13326f] focus:ring-[#13326f] focus:ring-opacity-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectType" className="text-[#13326f] font-medium">{t('risk.form.projectType', 'Project Type')}</Label>
                    <Select 
                      value={projectData.projectType}
                      onValueChange={(value) => handleSelectChange('projectType', value)}
                    >
                      <SelectTrigger id="projectType" className="border-[#d0d0c0] focus:ring-[#13326f] focus:ring-opacity-20">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="road">Road Infrastructure</SelectItem>
                        <SelectItem value="rail">Railway Infrastructure</SelectItem>
                        <SelectItem value="bridge">Bridge Construction</SelectItem>
                        <SelectItem value="dam">Dam Construction</SelectItem>
                        <SelectItem value="airport">Airport Development</SelectItem>
                        <SelectItem value="seaport">Seaport Development</SelectItem>
                        <SelectItem value="urban">Urban Infrastructure</SelectItem>
                        <SelectItem value="industrial">Industrial Infrastructure</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#13326f] font-medium">{t('risk.form.description', 'Project Description')}</Label>
                  <Textarea 
                    id="description" 
                    value={projectData.description}
                    onChange={handleInputChange}
                    placeholder="Enter a detailed description of the project" 
                    className="min-h-[100px] border-[#d0d0c0] focus:border-[#13326f] focus:ring-[#13326f] focus:ring-opacity-20" 
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f8f8f0] border-l-2 border-[#13326f] border-t border-r border-b border-t-[#d0d0c0] border-r-[#d0d0c0] border-b-[#d0d0c0] relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-[#13326f] border-l-[16px] border-l-transparent opacity-30"></div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-[#13326f] font-medium">{t('risk.form.location', 'Project Location')}</Label>
                    <Input 
                      id="location" 
                      value={projectData.location}
                      onChange={handleInputChange}
                      placeholder="State/District/Area" 
                      required
                      className="border-[#d0d0c0] focus:border-[#13326f] focus:ring-[#13326f] focus:ring-opacity-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landAcquisitionStatus" className="text-[#13326f] font-medium">{t('risk.form.landStatus', 'Land Acquisition Status')}</Label>
                    <Select 
                      value={projectData.landAcquisitionStatus}
                      onValueChange={(value) => handleSelectChange('landAcquisitionStatus', value)}
                    >
                      <SelectTrigger id="landAcquisitionStatus" className="border-[#d0d0c0] focus:ring-[#13326f] focus:ring-opacity-20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="mostly-complete">Mostly Complete</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="not-required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f8f8f0] border-l-2 border-[#13326f] border-t border-r border-b border-t-[#d0d0c0] border-r-[#d0d0c0] border-b-[#d0d0c0] relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-[#13326f] border-l-[16px] border-l-transparent opacity-30"></div>
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-[#13326f] font-medium">{t('risk.form.cost', 'Estimated Cost (in lakhs)')}</Label>
                    <Input 
                      id="cost" 
                      type="number" 
                      value={projectData.cost}
                      onChange={handleInputChange}
                      placeholder="e.g. 5000" 
                      required 
                      className="border-[#d0d0c0] focus:border-[#13326f] focus:ring-[#13326f] focus:ring-opacity-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-[#13326f] font-medium">{t('risk.form.duration', 'Project Duration (months)')}</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      value={projectData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 36" 
                      required 
                      className="border-[#d0d0c0] focus:border-[#13326f] focus:ring-[#13326f] focus:ring-opacity-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-gradient-to-br from-[#f8f8f0] to-[#f0f0e8] border-l-2 border-[#13326f] border-t border-r border-b border-t-[#d0d0c0] border-r-[#d0d0c0] border-b-[#d0d0c0] relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-[#13326f] border-l-[16px] border-l-transparent opacity-30"></div>
                  <Label className="text-[#13326f] font-medium">{t('risk.form.clearances', 'Required Clearances')}</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="environmentalClearance" className="text-[#13326f] font-medium">{t('risk.form.environmentalClearance', 'Environmental Clearance')}</Label>
                      <Select 
                        value={projectData.environmentalClearance ? "yes" : "no"}
                        onValueChange={(value) => handleCheckboxChange('environmentalClearance', value === "yes")}
                      >
                        <SelectTrigger id="environmentalClearance" className="border-[#d0d0c0] focus:ring-[#13326f] focus:ring-opacity-20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Obtained</SelectItem>
                          <SelectItem value="no">Not Obtained</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="forestClearance" className="text-[#13326f] font-medium">{t('risk.form.forestClearance', 'Forest Clearance')}</Label>
                      <Select 
                        value={projectData.forestClearance ? "yes" : "no"}
                        onValueChange={(value) => handleCheckboxChange('forestClearance', value === "yes")}
                      >
                        <SelectTrigger id="forestClearance" className="border-[#d0d0c0] focus:ring-[#13326f] focus:ring-opacity-20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Obtained</SelectItem>
                          <SelectItem value="no">Not Obtained</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="wildlifeClearance" className="text-[#13326f] font-medium">{t('risk.form.wildlifeClearance', 'Wildlife Clearance')}</Label>
                      <Select 
                        value={projectData.wildlifeClearance ? "yes" : "no"}
                        onValueChange={(value) => handleCheckboxChange('wildlifeClearance', value === "yes")}
                      >
                        <SelectTrigger id="wildlifeClearance" className="border-[#d0d0c0] focus:ring-[#13326f] focus:ring-opacity-20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Obtained</SelectItem>
                          <SelectItem value="no">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#13326f] to-[#1C4587] hover:from-[#0c225e] hover:to-[#13326f] text-white font-medium border-2 border-[#d0d0c0] shadow-md" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">{t('risk.form.analyzing', 'Analyzing...')}</span>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      {t('risk.form.analyze', 'Analyze Risk Factors')}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {submitted && (
            <div className="space-y-6">
              <Card className="border-[#d0d0c0] bg-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
                <CardHeader className="border-b border-[#d0d0c0] bg-gradient-to-r from-[#f0f0e8] to-[#f8f8f0]">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-1.5 bg-[#13326f]"></div>
                    <CardTitle>{t('risk.results.title', 'Risk Assessment Results')}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {t('risk.results.projectName', 'Project')}: <span className="font-medium">{projectData.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-sm">
                      <div className="font-medium text-[#13326f]">Report Generated:</div>
                      <div className="text-gray-600">{new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="relative h-20 w-20">
                      <div className="absolute inset-0 border-2 border-[#e53935] rounded-full flex items-center justify-center rotate-[-15deg] opacity-80">
                        <div className="text-[#e53935] text-xs text-center font-bold">
                          <div>ASSESSMENT</div>
                          <div>COMPLETED</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center p-6 border border-[#d0d0c0] rounded-lg bg-gradient-to-br from-[#f8f8f0] to-[#f0f0e8] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-5 w-1.5 bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808] mr-2"></div>
                        <h3 className="text-lg font-medium bg-gradient-to-r from-[#13326f] to-[#1C4587] text-transparent bg-clip-text">{t('risk.results.overallRisk', 'Overall Risk Score')}</h3>
                      </div>
                      <div className="relative h-40 w-40 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-3xl font-bold ${risk.color}`}>{overallRiskScore}%</span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" fill="none" stroke="#e8e8dc" strokeWidth="12">
                            <animate attributeName="stroke" values="#e8e8dc;#d0d0c0;#e8e8dc" dur="8s" repeatCount="indefinite" />
                          </circle>
                          <circle 
                            cx="60" 
                            cy="60" 
                            r="54" 
                            fill="none" 
                            stroke={risk.bgColor} 
                            strokeWidth="12" 
                            strokeDasharray={`${2 * Math.PI * 54 * overallRiskScore / 100} ${2 * Math.PI * 54 * (1 - overallRiskScore / 100)}`} 
                            strokeDashoffset={2 * Math.PI * 54 * 0.25} 
                          />
                        </svg>
                      </div>
                      
                      <div className="mt-4 inline-block border-t-4 pt-2" style={{ borderColor: risk.bgColor }}>
                        <p className={`text-xl font-bold ${risk.color}`}>{risk.category}</p>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-[#d0d0c0]">
                        <div className="text-center p-2 rounded-md bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9]">
                          <div className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-[#43a047] to-[#2e7d32] mb-1 shadow-sm"></div>
                          <p className="text-sm font-medium text-[#2e7d32]">Low: &lt;30%</p>
                        </div>
                        <div className="text-center p-2 rounded-md bg-gradient-to-br from-[#fff8e1] to-[#fffde7]">
                          <div className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-[#f9a825] to-[#f57f17] mb-1 shadow-sm"></div>
                          <p className="text-sm font-medium text-[#f57f17]">Moderate: 30-60%</p>
                        </div>
                        <div className="text-center p-2 rounded-md bg-gradient-to-br from-[#ffebee] to-[#ffcdd2]">
                          <div className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-[#e53935] to-[#c62828] mb-1 shadow-sm"></div>
                          <p className="text-sm font-medium text-[#c62828]">High: &gt;60%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center border-b border-[#d0d0c0] pb-2 mb-4">
                      <div className="h-5 w-1.5 bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808] mr-2"></div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-[#13326f] to-[#1C4587] text-transparent bg-clip-text">{t('risk.results.riskFactors', 'Risk Factors')}</h3>
                      <div className="flex-1 h-px ml-3 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"></div>
                    </div>
                    
                    <div className="space-y-4">
                      {riskFactors.map((factor) => (
                        <div key={factor.id} className="border border-[#d0d0c0] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                          <div className="absolute top-0 left-0 w-full h-0.5" style={{
                            background: factor.severity === 'high' ? 'linear-gradient(to right, #FF9933, #FFFFFF, #e53935)' : 
                                       factor.severity === 'medium' ? 'linear-gradient(to right, #FF9933, #FFFFFF, #f9a825)' : 
                                       'linear-gradient(to right, #FF9933, #FFFFFF, #138808)'
                          }}></div>
                          <div className="bg-gradient-to-r from-[#f0f0e8] to-[#f8f8f0] p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-1 mr-3 rounded-full" style={{
                                background: factor.severity === 'high' ? 'linear-gradient(to bottom, #e53935, #c62828)' : 
                                           factor.severity === 'medium' ? 'linear-gradient(to bottom, #f9a825, #f57f17)' : 
                                           'linear-gradient(to bottom, #43a047, #2e7d32)'
                              }}></div>
                              <div>
                                <h4 className="font-medium">{factor.name}</h4>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getSeverityColor(factor.severity)}`}>
                                  {factor.severity.charAt(0).toUpperCase() + factor.severity.slice(1)} Risk
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-semibold">{factor.score}%</span>
                              <div className="w-24 mt-1">
                                <Progress 
                                  value={factor.score} 
                                  className={`h-2 bg-[#e8e8dc] ${
                                    factor.severity === 'high' ? '[&>div]:bg-[#e53935]' : 
                                    factor.severity === 'medium' ? '[&>div]:bg-[#f9a825]' : '[&>div]:bg-[#43a047]'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700 mb-4">{factor.description}</p>
                            
                            <div className="p-3" style={{
                              background: factor.severity === 'high' ? 'linear-gradient(to right, #fff5f5, #fee2e2)' :
                                        factor.severity === 'medium' ? 'linear-gradient(to right, #fffbeb, #fef3c7)' :
                                        'linear-gradient(to right, #f0fdf4, #dcfce7)',
                              borderLeft: '2px solid',
                              borderColor: factor.severity === 'high' ? '#e53935' : 
                                        factor.severity === 'medium' ? '#f9a825' : '#43a047'
                            }}>
                              <h5 className="font-medium mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.63 2.63"></path>
                                  <path d="M19 10c-1.58-2.27-4.08-3.88-7-4"></path>
                                  <path d="m15 9 2 2"></path>
                                </svg>
                                {t('risk.results.recommendations', 'Recommendations')}
                              </h5>
                              <ul className="space-y-2 text-sm">
                                {factor.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="inline-block h-4 w-4 rounded-full text-white flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center text-xs" style={{
                                      background: factor.severity === 'high' ? 'linear-gradient(to bottom right, #e53935, #c62828)' : 
                                                factor.severity === 'medium' ? 'linear-gradient(to bottom right, #f9a825, #f57f17)' : 
                                                'linear-gradient(to bottom right, #43a047, #2e7d32)'
                                    }}>{idx + 1}</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#d0d0c0] bg-gradient-to-r from-[#f0f0e8] via-[#f8f8f0] to-[#f0f0e8]">
                  <Button variant="outline" className="border-[#13326f] text-[#13326f] hover:bg-gradient-to-r hover:from-[#e8e8dc] hover:to-[#f0f0e8]" onClick={() => setActiveTab('form')}>
                    <div className="flex items-center">
                      <div className="w-1 h-full bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808] mr-1.5"></div>
                      {t('risk.results.editInfo', 'Edit Information')}
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="border-[#13326f] text-[#13326f] hover:bg-gradient-to-r hover:from-[#f0f0e8] hover:to-[#e8e8dc]" onClick={() => {
                    setProjectData({
                      name: '',
                      description: '',
                      cost: '',
                      duration: '',
                      projectType: '',
                      location: '',
                      landAcquisitionStatus: '',
                      environmentalClearance: false,
                      forestClearance: false,
                      wildlifeClearance: false,
                    })
                    setSubmitted(false)
                    setActiveTab('form')
                  }}>
                    <div className="flex items-center">
                      <div className="w-1 h-full bg-gradient-to-b from-[#138808] via-[#FFFFFF] to-[#FF9933] mr-1.5"></div>
                      {t('risk.results.startNew', 'Start New Assessment')}
                    </div>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
      
      {/* Official footer with disclaimer */}
      <div className="bg-gradient-to-r from-[#0c225e] via-[#13326f] to-[#1C4587] text-white py-4 mt-8 border-t-2 border-[#FF9933]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="h-12 w-12 relative flex-shrink-0 mr-2">
              <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                   style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')" }}>
              </div>
            </div>
            <div className="text-sm md:text-base font-semibold">Ministry of Infrastructure Development</div>
          </div>
          <p className="text-xs text-gray-300 mb-1">This is a risk assessment tool for infrastructure projects. The results are indicative and should be used as guidance only.</p>
          <p className="text-xs text-gray-300">© {new Date().getFullYear()} Government of India. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  )
}

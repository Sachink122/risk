'use client'

import { useTranslation } from 'react-i18next'

/**
 * Component to provide translations for the risk prediction forms and UI
 */
export function useRiskPredictionTranslations() {
  const { t } = useTranslation()
  
  return {
    // Form labels
    form: {
      title: t('risk.advanced.title', 'Advanced Risk Prediction'),
      description: t('risk.advanced.description', 'Analyze detailed project parameters to generate a comprehensive risk assessment.'),
      projectInfo: t('risk.advanced.projectInfo', 'Project Information'),
      riskFactors: t('risk.advanced.riskFactors', 'Risk Factors'),
      riskAnalysis: t('risk.advanced.riskAnalysis', 'Risk Analysis'),
      submit: t('risk.advanced.submit', 'Generate Risk Assessment'),
      reset: t('risk.advanced.reset', 'Reset Form'),
      
      // Form fields
      fields: {
        name: t('risk.advanced.fields.name', 'Project Name'),
        description: t('risk.advanced.fields.description', 'Project Description'),
        cost: t('risk.advanced.fields.cost', 'Estimated Cost (in lakhs)'),
        duration: t('risk.advanced.fields.duration', 'Project Duration (in months)'),
        location: t('risk.advanced.fields.location', 'Project Location'),
        type: t('risk.advanced.fields.type', 'Project Type'),
        terrain: t('risk.advanced.fields.terrain', 'Terrain Complexity'),
        weather: t('risk.advanced.fields.weather', 'Weather Conditions'),
        laborAvailability: t('risk.advanced.fields.laborAvailability', 'Labor Availability'),
        materialAccess: t('risk.advanced.fields.materialAccess', 'Material Access'),
        infrastructureStatus: t('risk.advanced.fields.infrastructureStatus', 'Infrastructure Status'),
      },
      
      // Options
      options: {
        projectType: {
          road: t('risk.advanced.options.projectType.road', 'Road Construction'),
          bridge: t('risk.advanced.options.projectType.bridge', 'Bridge'),
          building: t('risk.advanced.options.projectType.building', 'Building'),
          water: t('risk.advanced.options.projectType.water', 'Water Management'),
          other: t('risk.advanced.options.projectType.other', 'Other'),
        },
        terrain: {
          flat: t('risk.advanced.options.terrain.flat', 'Flat/Easy'),
          moderate: t('risk.advanced.options.terrain.moderate', 'Moderate'),
          difficult: t('risk.advanced.options.terrain.difficult', 'Difficult'),
          extreme: t('risk.advanced.options.terrain.extreme', 'Extreme/Mountainous'),
        },
        weather: {
          mild: t('risk.advanced.options.weather.mild', 'Mild'),
          moderate: t('risk.advanced.options.weather.moderate', 'Moderate'),
          harsh: t('risk.advanced.options.weather.harsh', 'Harsh'),
          extreme: t('risk.advanced.options.weather.extreme', 'Extreme'),
        },
        availability: {
          abundant: t('risk.advanced.options.availability.abundant', 'Abundant'),
          adequate: t('risk.advanced.options.availability.adequate', 'Adequate'),
          limited: t('risk.advanced.options.availability.limited', 'Limited'),
          scarce: t('risk.advanced.options.availability.scarce', 'Scarce'),
        },
        infrastructure: {
          excellent: t('risk.advanced.options.infrastructure.excellent', 'Excellent'),
          good: t('risk.advanced.options.infrastructure.good', 'Good'),
          fair: t('risk.advanced.options.infrastructure.fair', 'Fair'),
          poor: t('risk.advanced.options.infrastructure.poor', 'Poor'),
        },
      },
    },
    
    // Results
    results: {
      title: t('risk.advanced.results.title', 'Risk Assessment Results'),
      overallRisk: t('risk.advanced.results.overallRisk', 'Overall Risk Level'),
      breakdown: t('risk.advanced.results.breakdown', 'Risk Breakdown'),
      mitigations: t('risk.advanced.results.mitigations', 'Recommended Mitigations'),
      comparison: t('risk.advanced.results.comparison', 'Comparative Analysis'),
      exportReport: t('risk.advanced.results.exportReport', 'Export Report'),
      riskFactors: {
        time: t('risk.advanced.results.factors.time', 'Time Risk'),
        cost: t('risk.advanced.results.factors.cost', 'Cost Risk'),
        quality: t('risk.advanced.results.factors.quality', 'Quality Risk'),
        environmental: t('risk.advanced.results.factors.environmental', 'Environmental Risk'),
        social: t('risk.advanced.results.factors.social', 'Social Risk'),
      },
      riskLevels: {
        low: t('risk.advanced.results.levels.low', 'Low'),
        medium: t('risk.advanced.results.levels.medium', 'Medium'),
        high: t('risk.advanced.results.levels.high', 'High'),
        critical: t('risk.advanced.results.levels.critical', 'Critical'),
      }
    }
  }
}
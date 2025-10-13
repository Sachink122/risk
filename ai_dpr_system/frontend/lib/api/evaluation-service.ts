import apiClient from './api-client';

export interface Evaluation {
  id: string;
  dpr_id: string;
  completeness: number;
  clarity: number;
  feasibility: number;
  budget: number;
  timeline: number;
  compliance: number;
  sustainability: number;
  overall: number;
  created_at: string;
  updated_at: string;
}

export interface EvaluationComment {
  id: string;
  evaluation_id: string;
  section: string;
  comment: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface RiskFactor {
  id: string;
  dpr_id: string;
  category: string;
  score: number;
  description: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  key_indicators: string[];
}

export interface RiskAnalysis {
  id: string;
  dpr_id: string;
  overall_risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  summary: string;
  recommendations: string[];
  created_at: string;
  updated_at: string;
  risk_factors: RiskFactor[];
}

// Evaluation and Risk Analysis services
export const evaluationService = {
  // Get evaluation by DPR ID
  getEvaluationByDprId: async (dprId: string) => {
    return apiClient.get(`/evaluations/dpr/${dprId}`);
  },

  // Get evaluation comments
  getEvaluationComments: async (evaluationId: string) => {
    return apiClient.get(`/evaluations/${evaluationId}/comments`);
  },

  // Initiate evaluation for a DPR
  initiateEvaluation: async (dprId: string) => {
    return apiClient.post(`/evaluations/dpr/${dprId}`);
  },

  // Get risk analysis by DPR ID
  getRiskAnalysisByDprId: async (dprId: string) => {
    return apiClient.get(`/risk-analysis/dpr/${dprId}`);
  },

  // Get risk factors for a DPR
  getRiskFactors: async (dprId: string) => {
    return apiClient.get(`/risk-analysis/dpr/${dprId}/factors`);
  },

  // Initiate risk analysis for a DPR
  initiateRiskAnalysis: async (dprId: string) => {
    return apiClient.post(`/risk-analysis/dpr/${dprId}`);
  },
};

export default evaluationService;
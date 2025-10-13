import apiClient from './api-client';

export interface DPR {
  id: string;
  title: string;
  project_code: string;
  department: string;
  location: string;
  sector: string;
  estimated_cost: number;
  upload_date: string;
  status: 'Pending' | 'In Progress' | 'Evaluated';
  description: string;
  file_path: string;
  user_id: string;
}

export interface DPRFilter {
  status?: string;
  riskLevel?: string;
  sector?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface DPRUpload {
  title: string;
  project_code: string;
  department: string;
  location: string;
  sector: string;
  estimated_cost: number;
  description: string;
  file: File;
}

// DPR services
export const dprService = {
  // Get all DPRs with optional filtering
  getAllDPRs: async (filter?: DPRFilter, page: number = 1, limit: number = 10) => {
    let url = `/dprs?page=${page}&limit=${limit}`;
    
    if (filter) {
      if (filter.status) url += `&status=${filter.status}`;
      if (filter.riskLevel) url += `&risk_level=${filter.riskLevel}`;
      if (filter.sector) url += `&sector=${filter.sector}`;
      if (filter.location) url += `&location=${filter.location}`;
      if (filter.startDate) url += `&start_date=${filter.startDate}`;
      if (filter.endDate) url += `&end_date=${filter.endDate}`;
    }
    
    return apiClient.get(url);
  },

  // Search DPRs
  searchDPRs: async (query: string, page: number = 1, limit: number = 10) => {
    return apiClient.get(`/dprs/search?q=${query}&page=${page}&limit=${limit}`);
  },

  // Get DPR by ID
  getDPRById: async (id: string) => {
    return apiClient.get(`/dprs/${id}`);
  },

  // Create new DPR with file upload
  createDPR: async (dprData: DPRUpload) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', dprData.file);
    formData.append('title', dprData.title);
    formData.append('project_code', dprData.project_code);
    formData.append('department', dprData.department);
    formData.append('location', dprData.location);
    formData.append('sector', dprData.sector);
    formData.append('estimated_cost', dprData.estimated_cost.toString());
    formData.append('description', dprData.description);
    
    return apiClient.post('/dprs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update DPR
  updateDPR: async (id: string, dprData: Partial<DPR>) => {
    return apiClient.put(`/dprs/${id}`, dprData);
  },

  // Delete DPR
  deleteDPR: async (id: string) => {
    return apiClient.delete(`/dprs/${id}`);
  },

  // Get DPR document
  getDPRDocument: async (id: string) => {
    return apiClient.get(`/dprs/${id}/document`, {
      responseType: 'blob',
    });
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiClient.get('/dprs/stats');
  },
};

export default dprService;
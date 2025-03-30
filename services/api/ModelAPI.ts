import axios from 'axios';

// Use local Next.js API routes instead of external URL
const API_URL = '/api';

interface ModelInfo {
  version: string;
  lastTrained: Date;
  accuracy: number;
  parameters?: {
    waitTimeFactors?: {
      patientVolume: number;
      staffAvailability: number;
      priorityWeight: number;
      timeOfDay: number;
    };
    resourceAllocation?: {
      doctors: number;
      nurses: number;
      rooms: number;
    };
  };
}

interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  waitTimeError: {
    mae: number; // Mean Absolute Error
    rmse: number; // Root Mean Square Error
  };
  confusionMatrix?: {
    truePositive: number;
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
  };
  lastUpdated: Date;
}

interface ResourceRecommendation {
  resourceType: string;
  currentCount: number;
  recommendedCount: number;
  impact: {
    waitTimeReduction: number;
    costIncrease: number;
    efficiencyGain: number;
  };
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface FlowRecommendation {
  area: string;
  issue: string;
  recommendation: string;
  impact: {
    waitTimeReduction: number;
    patientSatisfaction: number;
    staffEfficiency: number;
  };
  priority: 'high' | 'medium' | 'low';
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

interface ModelAPI {
  // Existing methods...
  getInfo(): Promise<ModelInfo>;
  train(): Promise<void>;
  getDiagnosisPrediction(symptoms: string[]): Promise<any>;
  predictWaitTimes(departmentFilter?: string): Promise<any>;
  getResourceRecommendations(): Promise<ResourceRecommendation[]>;
  getFlowRecommendations(): Promise<FlowRecommendation[]>;
  getPerformanceMetrics(): Promise<PerformanceMetrics>;
  generateSamples(count: number, addToQueue: boolean): Promise<any>;
}

const ModelAPI = {

  async train(): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/model/train`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to train model');
      }
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  },

  async getInfo(): Promise<ModelInfo> {
    try {
      const response = await axios.get(`${API_URL}/model/info`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get model info');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error getting model info:', error);
      throw error;
    }
  },

  async predictWaitTimes(departmentFilter?: string): Promise<any> {
    try {
      const url = departmentFilter 
        ? `${API_URL}/queue/predicted-wait-times?department=${departmentFilter}`
        : `${API_URL}/queue/predicted-wait-times`;
      
      const response = await axios.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to predict wait times');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error predicting wait times:', error);
      throw error;
    }
  },

  async getResourceRecommendations(): Promise<ResourceRecommendation[]> {
    try {
      const response = await axios.get(`${API_URL}/model/resource-recommendations`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get resource recommendations');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error getting resource recommendations:', error);
      throw error;
    }
  },

  async getFlowRecommendations(): Promise<FlowRecommendation[]> {
    try {
      const response = await axios.get(`${API_URL}/model/flow-recommendations`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get flow recommendations');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error getting flow recommendations:', error);
      throw error;
    }
  },

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await axios.get(`${API_URL}/model/performance`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get performance metrics');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  },

  async getDiagnosisPrediction(symptoms: string[]): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/model/diagnose`, { symptoms });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get diagnosis prediction');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error getting diagnosis prediction:', error);
      throw error;
    }
  },

  async generateSamples(count: number, addToQueue: boolean = false): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/model/generate-samples`, { 
        count, 
        addToQueue 
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to generate samples');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error generating samples:', error);
      throw error;
    }
  }
};

export default ModelAPI;

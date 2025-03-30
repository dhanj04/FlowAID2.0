import axios from 'axios';

// Use local Next.js API routes instead of external URL
const API_URL = '/api';

interface FacilityResources {
  doctors: number;
  nurses: number;
  rooms: number;
  equipment?: Record<string, number>;
}

interface DepartmentLoad {
  [department: string]: number;
}

interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

// Simple processing times format used in the dashboard
interface SimpleProcessingTimes {
  [department: string]: number;
}

// Detailed processing times format for API responses
interface DetailedProcessingTimes {
  [department: string]: {
    averageTime: number;
    minimumTime: number;
    maximumTime: number;
  };
}

// Combined state interface that matches what the dashboard expects
interface FacilityState {
  isOpen: boolean;
  currentStatus: 'normal' | 'busy' | 'emergency' | 'closed';
  message?: string;
  resources: FacilityResources;
  departmentLoads: DepartmentLoad;
  averageProcessingTimes: SimpleProcessingTimes;
}

interface FacilitySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: OperatingHours[];
  departments: string[];
  resources: FacilityResources;
  departmentLoads: DepartmentLoad;
  maxCapacity: number;
  currentCapacity: number;
}

interface FacilityStats {
  patientsServed: number;
  averageWaitTime: number;
  currentCapacity: number;
  maxCapacity: number;
  utilizationRate: number;
  departmentStats: {
    [department: string]: {
      patientsServed: number;
      averageWaitTime: number;
      utilizationRate: number;
    };
  };
}

const FacilityAPI = {
  /**
   * Get facility resources (doctors, nurses, rooms, equipment)
   */
  getResources: async (): Promise<FacilityResources> => {
    try {
      const response = await axios.get(`${API_URL}/facility/resources`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get facility resources');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility resources:', error);
      // Return default values to prevent UI errors
      return { doctors: 0, nurses: 0, rooms: 0 };
    }
  },

  /**
   * Update facility resources
   */
  updateResources: async (resources: Partial<FacilityResources>): Promise<FacilityResources> => {
    try {
      const response = await axios.put(`${API_URL}/facility/resources`, resources);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update facility resources');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating facility resources:', error);
      throw error;
    }
  },

  /**
   * Get department loads
   */
  getDepartmentLoads: async (): Promise<DepartmentLoad> => {
    try {
      const response = await axios.get(`${API_URL}/facility/department-loads`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get department loads');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching department loads:', error);
      // Return empty object to prevent UI errors
      return {};
    }
  },

  /**
   * Update department loads
   */
  updateDepartmentLoads: async (departmentLoads: DepartmentLoad): Promise<DepartmentLoad> => {
    try {
      const response = await axios.put(`${API_URL}/facility/department-loads`, departmentLoads);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update department loads');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating department loads:', error);
      throw error;
    }
  },

  /**
   * Get facility settings
   */
  getSettings: async (): Promise<FacilitySettings> => {
    try {
      const response = await axios.get(`${API_URL}/facility/settings`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get facility settings');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility settings:', error);
      // Return default values to prevent UI errors
      return {
        name: 'Unknown Facility',
        address: '',
        phone: '',
        email: '',
        operatingHours: [],
        departments: [],
        resources: { doctors: 0, nurses: 0, rooms: 0 },
        departmentLoads: {},
        maxCapacity: 0,
        currentCapacity: 0
      };
    }
  },

  /**
   * Update facility settings
   */
  updateSettings: async (settings: Partial<FacilitySettings>): Promise<FacilitySettings> => {
    try {
      const response = await axios.put(`${API_URL}/facility/settings`, settings);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update facility settings');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating facility settings:', error);
      throw error;
    }
  },

  /**
   * Get facility capacity
   */
  getCapacity: async () => {
    try {
      const response = await axios.get(`${API_URL}/facility/capacity`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get facility capacity');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility capacity:', error);
      // Return default values to prevent UI errors
      return { currentCapacity: 0, maxCapacity: 0 };
    }
  },

  /**
   * Update facility capacity
   */
  updateCapacity: async (capacity: { maxCapacity: number }) => {
    try {
      const response = await axios.put(`${API_URL}/facility/capacity`, capacity);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update facility capacity');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating facility capacity:', error);
      throw error;
    }
  },

  /**
   * Get operating hours
   */
  getOperatingHours: async (): Promise<OperatingHours[]> => {
    try {
      const response = await axios.get(`${API_URL}/facility/operating-hours`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get operating hours');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching operating hours:', error);
      // Return empty array to prevent UI errors
      return [];
    }
  },

  /**
   * Update operating hours
   */
  updateOperatingHours: async (hours: OperatingHours[]): Promise<OperatingHours[]> => {
    try {
      const response = await axios.put(`${API_URL}/facility/operating-hours`, { hours });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update operating hours');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating operating hours:', error);
      throw error;
    }
  },

  /**
   * Get departments
   */
  getDepartments: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_URL}/facility/departments`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get departments');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Return default values to prevent UI errors
      return ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'];
    }
  },

  /**
   * Update departments
   */
  updateDepartments: async (departments: string[]): Promise<string[]> => {
    try {
      const response = await axios.put(`${API_URL}/facility/departments`, { departments });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update departments');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating departments:', error);
      throw error;
    }
  },

  /**
   * Get facility state (open/closed, status)
   */
  getState: async (): Promise<FacilityState> => {
    try {
      const response = await axios.get(`${API_URL}/facility/state`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get facility state');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility state:', error);
      // Return default values to prevent UI errors
      return {
        isOpen: true,
        currentStatus: 'normal',
        resources: { doctors: 0, nurses: 0, rooms: 0 },
        departmentLoads: {},
        averageProcessingTimes: {}
      };
    }
  },

  /**
   * Update facility state
   */
  updateState: async (state: Partial<FacilityState>): Promise<FacilityState> => {
    try {
      const response = await axios.put(`${API_URL}/facility/state`, state);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update facility state');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating facility state:', error);
      throw error;
    }
  },

  /**
   * Get processing times for departments
   */
  getProcessingTimes: async (): Promise<SimpleProcessingTimes> => {
    try {
      const response = await axios.get(`${API_URL}/facility/processing-times`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get processing times');
      }
      
      // Handle both simple and detailed processing times formats
      const data = response.data.data;
      
      // If the response is already in the simple format, return it directly
      if (typeof Object.values(data)[0] === 'number') {
        return data;
      }
      
      // Otherwise convert from detailed to simple format
      const simpleProcessingTimes: SimpleProcessingTimes = {};
      
      Object.keys(data).forEach(department => {
        simpleProcessingTimes[department] = data[department].averageTime;
      });
      
      return simpleProcessingTimes;
    } catch (error) {
      console.error('Error fetching processing times:', error);
      // Return empty object to prevent UI errors
      return {};
    }
  },

  /**
   * Update processing times for departments
   */
  updateProcessingTimes: async (processingTimes: SimpleProcessingTimes): Promise<SimpleProcessingTimes> => {
    try {
      // Convert simple processing times to detailed format for API
      const detailedProcessingTimes: DetailedProcessingTimes = {};
      
      Object.keys(processingTimes).forEach(department => {
        const averageTime = processingTimes[department];
        
        detailedProcessingTimes[department] = {
          averageTime,
          minimumTime: Math.floor(averageTime * 0.7), // Estimate min time as 70% of average
          maximumTime: Math.ceil(averageTime * 1.5)  // Estimate max time as 150% of average
        };
      });
      
      const response = await axios.put(`${API_URL}/facility/processing-times`, {
        processingTimes: detailedProcessingTimes
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update processing times');
      }
      
      // Return original simple format
      return processingTimes;
    } catch (error) {
      console.error('Error updating processing times:', error);
      throw error;
    }
  },

  /**
   * Reset facility state to default values
   */
  resetState: async (): Promise<void> => {
    try {
      const response = await axios.post(`${API_URL}/facility/reset`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to reset facility state');
      }
    } catch (error) {
      console.error('Error resetting facility state:', error);
      throw error;
    }
  },

  /**
   * Get facility statistics
   */
  getStats: async (): Promise<FacilityStats> => {
    try {
      const response = await axios.get(`${API_URL}/facility/stats`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get facility statistics');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching facility statistics:', error);
      // Return default values to prevent UI errors
      return {
        patientsServed: 0,
        averageWaitTime: 0,
        currentCapacity: 0,
        maxCapacity: 0,
        utilizationRate: 0,
        departmentStats: {}
      };
    }
  }
};

export default FacilityAPI;

import axios from 'axios';

// Use local Next.js API routes instead of external URL
const API_URL = '/api';

// Define Patient interface directly to avoid circular dependency
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  contactNumber: string;
  email?: string;
  symptoms?: string;
  department: string;
  priority: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  arrivalTime: string;
  startTime?: string;
  endTime?: string;
  appointmentTime?: string | null;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  actualProcedureTime?: number;
  resources?: ('doctor' | 'nurse' | 'lab' | 'imaging' | 'specialist')[];
}

// Queue data structure returned by getCurrent
interface QueueData {
  patients: Patient[];
  waitTimes: {
    department: string;
    averageWaitTime: number;
    currentWaitTime: number;
  }[];
  departmentBreakdown: {
    department: string;
    count: number;
    percentage: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

// API Response interface for consistent typing
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const QueueAPI = {
  /**
   * Get all patients in the queue
   */
  async getAll(departmentFilter?: string): Promise<Patient[]> {
    try {
      const url = departmentFilter
        ? `${API_URL}/queue?department=${encodeURIComponent(departmentFilter)}`
        : `${API_URL}/queue`;
      
      const response = await axios.get<ApiResponse<Patient[]>>(url);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Queue data returned without success flag or data');
      return [];
    } catch (error) {
      console.error('Error fetching queue:', error);
      return [];
    }
  },

  /**
   * Get current queue data with analytics
   */
  async getCurrent(): Promise<QueueData | null> {
    try {
      const response = await axios.get<ApiResponse<QueueData>>(`${API_URL}/queue/current`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Queue data returned without success flag or data');
      return null;
    } catch (error) {
      console.error('Error fetching current queue data:', error);
      return null;
    }
  },

  /**
   * Add a new patient to the queue
   */
  async addPatient(patientData: Omit<Patient, 'id'>): Promise<Patient | null> {
    try {
      const response = await axios.post<ApiResponse<Patient>>(`${API_URL}/queue`, patientData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Patient add operation returned without success flag or data');
      return null;
    } catch (error) {
      console.error('Error adding patient to queue:', error);
      return null;
    }
  },

  /**
   * Update a patient's status in the queue
   */
  async updateStatus(patientId: string, status: string): Promise<Patient | null> {
    try {
      const response = await axios.put<ApiResponse<Patient>>(`${API_URL}/queue/${patientId}/status`, { status });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Status update returned without success flag or data');
      return null;
    } catch (error) {
      console.error('Error updating patient status:', error);
      return null;
    }
  },

  /**
   * Get queue statistics
   */
  async getStatistics(departmentFilter?: string) {
    try {
      const url = departmentFilter
        ? `${API_URL}/queue/statistics?department=${encodeURIComponent(departmentFilter)}`
        : `${API_URL}/queue/statistics`;
      
      const response = await axios.get(url);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Queue statistics returned without success flag or data');
      return {
        averageWaitTime: 0,
        totalPatients: 0,
        departmentBreakdown: [],
        statusBreakdown: []
      };
    } catch (error) {
      console.error('Error fetching queue statistics:', error);
      return {
        averageWaitTime: 0,
        totalPatients: 0,
        departmentBreakdown: [],
        statusBreakdown: []
      };
    }
  },

  /**
   * Get predicted wait times
   */
  async getPredictedWaitTimes(departmentFilter?: string) {
    try {
      const url = departmentFilter
        ? `${API_URL}/queue/predicted-wait-times?department=${encodeURIComponent(departmentFilter)}`
        : `${API_URL}/queue/predicted-wait-times`;
      
      const response = await axios.get(url);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Predicted wait times returned without success flag or data');
      return [];
    } catch (error) {
      console.error('Error fetching predicted wait times:', error);
      return [];
    }
  },

  /**
   * Update a patient in the queue
   */
  async update(patientId: string, patientData: Partial<Patient>): Promise<Patient | null> {
    try {
      const response = await axios.put<ApiResponse<Patient>>(`${API_URL}/queue/${patientId}`, patientData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn('Patient update returned without success flag or data');
      return null;
    } catch (error) {
      console.error('Error updating patient:', error);
      return null;
    }
  },

  /**
   * Update queue
   */
  async updateQueue() {
    try {
      const response = await axios.post<ApiResponse<any>>(`${API_URL}/queue/update`);
      
      if (response.data.success) {
        return response.data.data || { updated: true };
      }
      
      console.warn('Queue update returned without success flag');
      return { updated: false };
    } catch (error) {
      console.error('Error updating queue:', error);
      return { updated: false };
    }
  },

  /**
   * Get patients by department
   */
  async getDepartment(department: string): Promise<Patient[]> {
    try {
      const response = await axios.get<ApiResponse<Patient[]>>(`${API_URL}/queue/department/${department}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.warn(`Department ${department} data returned without success flag or data`);
      return [];
    } catch (error) {
      console.error(`Error fetching patients for department ${department}:`, error);
      return [];
    }
  },
  
  /**
   * Add demo patients to the queue
   */
  async addDemoPatients(count: number = 5): Promise<boolean> {
    try {
      const response = await axios.post<ApiResponse<any>>(`${API_URL}/queue/add-demo`, { count });
      
      if (response.data.success) {
        return true;
      }
      
      console.warn('Demo patients add returned without success flag');
      return false;
    } catch (error) {
      console.error('Error adding demo patients:', error);
      return false;
    }
  },
  
  /**
   * Clear the queue
   */
  async clearQueue(): Promise<boolean> {
    try {
      const response = await axios.delete<ApiResponse<any>>(`${API_URL}/queue/clear`);
      
      if (response.data.success) {
        return true;
      }
      
      console.warn('Queue clear returned without success flag');
      return false;
    } catch (error) {
      console.error('Error clearing queue:', error);
      return false;
    }
  }
};

export default QueueAPI;

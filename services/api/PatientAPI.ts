import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  contactNumber: string;
  email?: string;
  symptoms?: string;
  department: string;
  priority: string;
  status?: string;
  arrivalTime?: string;
  appointmentTime?: string | null;
  estimatedProcedureTime?: number;
}

const PatientAPI = {
  /**
   * Add a new patient to the queue
   */
  add: async (patientData: PatientData) => {
    try {
      // Ensure patient data is properly formatted
      const formattedData = {
        ...patientData,
        arrivalTime: patientData.arrivalTime || new Date().toISOString(),
        status: patientData.status || 'waiting'
      };
      
      const response = await axios.post(`${API_URL}/api/patients`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  /**
   * Get a patient by ID
   */
  getById: async (patientId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw error;
    }
  },

  /**
   * Update a patient's information
   */
  update: async (patientId: string, patientData: Partial<PatientData>) => {
    try {
      const response = await axios.put(`${API_URL}/api/patients/${patientId}`, patientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient ${patientId}:`, error);
      throw error;
    }
  },

  /**
   * Get a patient's history
   */
  getHistory: async (patientId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/patients/${patientId}/history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for patient ${patientId}:`, error);
      throw error;
    }
  },

  /**
   * Search for patients by name, ID, or other criteria
   */
  search: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/patients/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  },

  /**
   * Force an update of the queue after facility settings change
   */
  forceQueueUpdate: async () => {
    try {
      const response = await axios.post(`${API_URL}/api/queue/update`);
      return response.data;
    } catch (error) {
      console.error('Error forcing queue update:', error);
      throw error;
    }
  }
};

export default PatientAPI;

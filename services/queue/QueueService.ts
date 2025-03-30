import { QueueAPI, PatientAPI, ModelAPI } from '../api';
import type { Patient } from '../api/QueueAPI';

export type { Patient };

export interface QueueStatistics {
  totalPatients: number;
  waitingPatients: number;
  inProgressPatients: number;
  completedPatients: number;
  cancelledPatients: number;
  noShowPatients: number;
  averageWaitTime: number;
  averageProcedureTime: number;
  departmentBreakdown: {
    [department: string]: {
      count: number;
      percentage: number;
    };
  };
}

const QueueService = {
  /**
   * Get all patients in the queue
   */
  getAllPatients: async (departmentFilter?: string): Promise<Patient[]> => {
    return await QueueAPI.getAll(departmentFilter);
  },

  /**
   * Add a new patient to the queue
   */
  addPatient: async (patientData: Omit<Patient, 'id' | 'status' | 'arrivalTime'>) => {
    return await PatientAPI.add({
      ...patientData,
      status: 'waiting',
      arrivalTime: new Date().toISOString()
    });
  },

  /**
   * Update a patient's status
   */
  updatePatientStatus: async (patientId: string, status: Patient['status']) => {
    // Update timestamps based on status change
    const now = new Date().toISOString();
    let additionalData = {};
    
    if (status === 'in-progress') {
      additionalData = { startTime: now };
    } else if (status === 'completed') {
      additionalData = { endTime: now };
    }
    
    // Update patient status and additional data
    await PatientAPI.update(patientId, { status, ...additionalData });
    
    // Update status in queue
    return await QueueAPI.updateStatus(patientId, status);
  },

  /**
   * Get queue statistics
   */
  getStatistics: async (departmentFilter?: string): Promise<QueueStatistics> => {
    return await QueueAPI.getStatistics(departmentFilter);
  },

  /**
   * Get predicted wait times
   */
  getPredictedWaitTimes: async (departmentFilter?: string) => {
    return await QueueAPI.getPredictedWaitTimes(departmentFilter);
  },

  /**
   * Calculate estimated wait time for a new patient
   */
  calculateEstimatedWaitTime: async (department: string, priority: string) => {
    try {
      // Get current queue statistics
      const stats = await QueueAPI.getStatistics(department);
      
      // Get model predictions
      const predictions = await ModelAPI.predictWaitTimes(department);
      
      // Apply priority factor
      const priorityFactor = {
        'emergency': 0.2,  // 80% reduction in wait time
        'high': 0.5,       // 50% reduction in wait time
        'normal': 1.0,     // Standard wait time
        'low': 1.5         // 50% increase in wait time
      }[priority] || 1.0;
      
      // Calculate estimated wait time based on predictions and priority
      const baseWaitTime = predictions.averageWaitTime || stats.averageWaitTime || 15;
      const estimatedWaitTime = baseWaitTime * priorityFactor;
      
      return Math.round(estimatedWaitTime);
    } catch (error) {
      console.error('Error calculating estimated wait time:', error);
      // Return a default estimate if calculation fails
      return 15; // 15 minutes default
    }
  },

  /**
   * Get resource optimization recommendations
   */
  getResourceRecommendations: async () => {
    return await ModelAPI.getResourceRecommendations();
  },

  /**
   * Get patient flow optimization recommendations
   */
  getFlowRecommendations: async () => {
    return await ModelAPI.getFlowRecommendations();
  }
};

export default QueueService;

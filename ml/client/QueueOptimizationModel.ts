import * as tf from '@tensorflow/tfjs';

// Patient priority factors with weights
export interface PatientFactors {
  urgencyLevel: number; // 1-5 (1 being lowest, 5 being highest)
  appointmentType: string; // 'regular', 'urgent', 'follow-up', 'specialist'
  ageGroup: string; // 'child', 'adult', 'senior'
  specialNeeds: boolean; // Does patient have special needs?
  appointmentTime?: Date; // Scheduled appointment time if any
  arrivalTime: Date; // Actual arrival time
  estimatedProcedureTime: number; // in minutes
  previousWaitHistory?: number; // average previous wait times in minutes
}

// Resource availability
export interface ResourceAvailability {
  doctors: number; // Number of available doctors
  nurses: number; // Number of available nurses
  rooms: number; // Number of available rooms
  specialEquipment: { [key: string]: number }; // Special equipment availability
}

// Facility current state
export interface FacilityState {
  currentPatientCount: number;
  averageProcessingTime: number; // in minutes
  peakHours: boolean; // Are we in peak hours?
  resources: ResourceAvailability;
  departmentLoads: { [key: string]: number }; // Load by department (0-1)
}

export interface QueueItem {
  id: string;
  priorityScore: number;
  predictedWaitTime: number;
}

export class QueueOptimizationModel {
  private model: tf.LayersModel | null = null;
  private isModelLoaded: boolean = false;
  private readonly patientTypeWeights: { [key: string]: number } = {
    'regular': 1.0,
    'follow-up': 1.2,
    'urgent': 1.8,
    'specialist': 1.5
  };
  private readonly ageGroupWeights: { [key: string]: number } = {
    'adult': 1.0,
    'senior': 1.3,
    'child': 1.4
  };

  constructor() {
    // Initialize the model
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    try {
      // Try to load a pre-trained model first
      try {
        this.model = await tf.loadLayersModel('/models/queue_optimization_model/model.json');
        console.log('Loaded pre-trained queue optimization model');
        this.isModelLoaded = true;
      } catch (error) {
        console.log('Pre-trained model not found, creating a new one');
        this.buildModel();
      }
    } catch (error) {
      console.error('Failed to initialize model:', error);
    }
  }

  private buildModel(): void {
    // Create a new sequential model
    const model = tf.sequential();
    
    // Input layer: 10 features
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
      inputShape: [10]
    }));
    
    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 16, 
      activation: 'relu'
    }));
    
    // Output layer: wait time prediction
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear' // Linear activation for regression
    }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['meanAbsoluteError']
    });
    
    this.model = model;
    this.isModelLoaded = true;
    console.log('Built new queue optimization model');
  }

  // Train the model with historical data
  public async trainModel(trainingData: any[], epochs: number = 50): Promise<tf.History> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('Model not initialized');
    }

    // Extract features and labels from training data
    const features = trainingData.map(data => this.extractFeatures(data.patient, data.facility));
    const labels = trainingData.map(data => data.actualWaitTime);

    // Convert to tensors
    const xs = tf.tensor2d(features);
    const ys = tf.tensor1d(labels);

    // Train the model
    const history = await this.model.fit(xs, ys, {
      epochs,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}, val_loss = ${logs?.val_loss?.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    xs.dispose();
    ys.dispose();

    // Save the model
    await this.saveModel();

    return history;
  }

  // Save the model
  private async saveModel(): Promise<void> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('Model not initialized');
    }

    try {
      await this.model.save('indexeddb://queue_optimization_model');
      console.log('Model saved to IndexedDB');
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  }

  // Extract features from patient and facility data
  private extractFeatures(patient: PatientFactors, facility: FacilityState): number[] {
    const appointmentTimeFactor = patient.appointmentTime ? 
      this.calculateTimeDifference(patient.arrivalTime, patient.appointmentTime) : 0;
    
    const features = [
      patient.urgencyLevel,
      this.patientTypeWeights[patient.appointmentType] || 1.0,
      this.ageGroupWeights[patient.ageGroup] || 1.0,
      patient.specialNeeds ? 1.0 : 0.0,
      appointmentTimeFactor,
      patient.estimatedProcedureTime,
      patient.previousWaitHistory || 0,
      facility.currentPatientCount,
      facility.averageProcessingTime,
      facility.peakHours ? 1.0 : 0.0,
    ];

    return features;
  }

  // Calculate time difference in hours (negative if arrived before appointment)
  private calculateTimeDifference(arrivalTime: Date, appointmentTime: Date): number {
    const diffMs = arrivalTime.getTime() - appointmentTime.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  }

  // Predict wait time for a patient
  public async predictWaitTime(patient: PatientFactors, facility: FacilityState): Promise<number> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('Model not initialized');
    }

    // Extract features
    const features = this.extractFeatures(patient, facility);
    const input = tf.tensor2d([features]);

    // Make prediction
    const prediction = await this.model.predict(input) as tf.Tensor;
    const waitTime = (await prediction.data())[0];

    // Clean up tensors
    input.dispose();
    prediction.dispose();

    return Math.max(0, waitTime); // Ensure wait time is non-negative
  }

  // Calculate patient priority score
  public calculatePriorityScore(patient: PatientFactors, currentWaitTime: number): number {
    const urgencyWeight = patient.urgencyLevel * 10;
    
    // Type weights
    let typeWeight = 1.0;
    if (patient.appointmentType === 'follow-up') typeWeight = 1.2;
    else if (patient.appointmentType === 'urgent') typeWeight = 1.8;
    else if (patient.appointmentType === 'specialist') typeWeight = 1.5;
    
    // Age group weights
    let ageWeight = 1.0;
    if (patient.ageGroup === 'senior') ageWeight = 1.3;
    else if (patient.ageGroup === 'child') ageWeight = 1.4;
    
    const specialNeedsWeight = patient.specialNeeds ? 5 : 0;
    const waitTimeWeight = Math.log(currentWaitTime + 1) * 3; // Logarithmic scaling to prioritize long waits
    
    // Calculate if patient is late or early for appointment
    let appointmentTimeWeight = 0;
    if (patient.appointmentTime) {
      const timeDiff = this.calculateTimeDifference(patient.arrivalTime, patient.appointmentTime);
      // Negative if early, positive if late
      appointmentTimeWeight = timeDiff < 0 ? 5 : 0; // Prioritize patients who arrived early
    }
    
    const priorityScore = 
      urgencyWeight + 
      (typeWeight * 5) + 
      (ageWeight * 3) + 
      specialNeedsWeight + 
      waitTimeWeight + 
      appointmentTimeWeight;
    
    return priorityScore;
  }

  // Optimize the queue based on current patients and facility state
  public optimizeQueue(
    patients: Array<{ id: string; factors: PatientFactors; currentWaitTime: number }>,
    facility: FacilityState
  ): Array<{ id: string; predictedWaitTime: number; priorityScore: number }> {
    // Calculate priority scores and predicted wait times
    const queueItems = patients.map(patient => {
      const priorityScore = this.calculatePriorityScore(patient.factors, patient.currentWaitTime);
      return {
        id: patient.id,
        predictedWaitTime: 0, // Will be filled in async
        priorityScore
      };
    });

    // Sort by priority score (highest first)
    return queueItems.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // Update the queue with predicted wait times asynchronously
  public async updateQueueWithPredictions(
    queue: Array<{ id: string; predictedWaitTime: number; priorityScore: number }>,
    patients: Array<{ id: string; factors: PatientFactors }>,
    facility: FacilityState
  ): Promise<Array<{ id: string; predictedWaitTime: number; priorityScore: number }>> {
    // Create a map of patient IDs to factors for quick lookup
    const patientMap = new Map(patients.map(p => [p.id, p.factors]));

    // Predict wait times for each patient in the queue
    const updatedQueue = [...queue];
    for (let i = 0; i < updatedQueue.length; i++) {
      const patientId = updatedQueue[i].id;
      const patientFactors = patientMap.get(patientId);
      
      if (patientFactors) {
        // Use model to predict wait time
        try {
          const waitTime = await this.predictWaitTime(patientFactors, facility);
          updatedQueue[i].predictedWaitTime = waitTime;
        } catch (error) {
          console.error(`Failed to predict wait time for patient ${patientId}:`, error);
          // Fallback to a simple estimation in case of model failure
          updatedQueue[i].predictedWaitTime = this.fallbackWaitTimeEstimation(patientFactors, facility, i);
        }
      }
    }

    return updatedQueue;
  }

  // Simple fallback estimation in case the ML model fails
  private fallbackWaitTimeEstimation(
    patient: PatientFactors, 
    facility: FacilityState, 
    queuePosition: number
  ): number {
    const baseTime = facility.averageProcessingTime; 
    const positionFactor = queuePosition * (baseTime * 0.8);
    const urgencyAdjustment = 5 * (5 - patient.urgencyLevel); // Higher urgency (5) means less wait time
    const procedureTimeFactor = patient.estimatedProcedureTime * 0.2;
    
    // Simple formula for wait time estimation
    return Math.max(0, positionFactor + urgencyAdjustment + procedureTimeFactor);
  }

  // Allocate resources optimally
  public allocateResources(
    queue: Array<{ id: string; predictedWaitTime: number; priorityScore: number }>,
    patients: Array<{ id: string; factors: PatientFactors }>,
    facility: FacilityState
  ): { [patientId: string]: { resourceType: string; resourceId: string } } {
    const allocations: { [patientId: string]: { resourceType: string; resourceId: string } } = {};
    const patientMap = new Map(patients.map(p => [p.id, p.factors]));
    
    // Sort queue by priority
    const prioritizedQueue = [...queue].sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Track resource usage
    const resourceUsage = {
      doctors: Array(facility.resources.doctors).fill(false),
      nurses: Array(facility.resources.nurses).fill(false),
      rooms: Array(facility.resources.rooms).fill(false),
    };
    
    // Allocate resources to patients
    for (const item of prioritizedQueue) {
      const patient = patientMap.get(item.id);
      if (!patient) continue;
      
      // Determine needed resources
      const needsDoctor = true; // All patients need a doctor
      const needsRoom = true; // All patients need a room
      const needsNurse = patient.urgencyLevel >= 3 || patient.specialNeeds; // Higher urgency or special needs
      
      // Find available resources
      let doctorId: string | null = null;
      let roomId: string | null = null;
      let nurseId: string | null = null;
      
      // Find available doctor
      for (let i = 0; i < resourceUsage.doctors.length; i++) {
        if (!resourceUsage.doctors[i]) {
          resourceUsage.doctors[i] = true;
          doctorId = `doctor_${i}`;
          break;
        }
      }
      
      // Find available room
      for (let i = 0; i < resourceUsage.rooms.length; i++) {
        if (!resourceUsage.rooms[i]) {
          resourceUsage.rooms[i] = true;
          roomId = `room_${i}`;
          break;
        }
      }
      
      // Find available nurse if needed
      if (needsNurse) {
        for (let i = 0; i < resourceUsage.nurses.length; i++) {
          if (!resourceUsage.nurses[i]) {
            resourceUsage.nurses[i] = true;
            nurseId = `nurse_${i}`;
            break;
          }
        }
      }
      
      // Allocate resources
      if (doctorId && roomId) {
        allocations[item.id] = {
          resourceType: needsNurse && nurseId ? 'doctor_nurse_room' : 'doctor_room',
          resourceId: `${doctorId}|${nurseId || ''}|${roomId}`
        };
      }
    }
    
    return allocations;
  }
} 
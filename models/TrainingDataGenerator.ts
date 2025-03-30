import { PatientFactors, FacilityState, ResourceAvailability } from '../../models/QueueOptimizationModel';

/**
 * Training data generator for the Queue Optimization Model
 * 
 * This class generates synthetic data for training the ML model.
 * It creates realistic patient scenarios, facility states, and
 * calculates wait times based on predefined rules.
 */
export class TrainingDataGenerator {
  constructor() {
    console.log('TrainingDataGenerator initialized');
  }

  // Configuration for data generation bounds
  private config = {
    maxPatients: 50,
    maxDoctors: 10,
    maxNurses: 15,
    maxRooms: 12,
    maxSpecialEquipment: 5,
    maxWaitTime: 180, // minutes
    maxProcedureTime: 120, // minutes
    departmentNames: ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'],
    appointmentTypes: ['regular', 'follow-up', 'urgent', 'specialist'],
    ageGroups: ['child', 'adult', 'senior'],
    // Weights to influence wait time calculation
    weights: {
      urgency: 10,
      patientCount: 0.8,
      doctorAvailability: 15,
      nurseAvailability: 5,
      roomAvailability: 12,
      peakHour: 20,
      procedureTime: 0.7,
      specialNeeds: 10,
      appointmentType: {
        'regular': 0,
        'follow-up': -5,
        'urgent': -20,
        'specialist': -10
      },
      ageGroup: {
        'child': -5,
        'adult': 0,
        'senior': 5
      }
    }
  };

  /**
   * Generate a random date within a range
   */
  private randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random special equipment availability
   */
  private generateSpecialEquipment(): { [key: string]: number } {
    const equipment: { [key: string]: number } = {};
    const equipmentTypes = ['X-Ray', 'MRI', 'Ultrasound', 'CT Scan', 'ECG'];
    
    equipmentTypes.forEach(type => {
      equipment[type] = this.randomInt(0, this.config.maxSpecialEquipment);
    });
    
    return equipment;
  }

  /**
   * Generate random department loads
   */
  private generateDepartmentLoads(): { [key: string]: number } {
    const loads: { [key: string]: number } = {};
    
    this.config.departmentNames.forEach(dept => {
      // Random load between 0.1 and 1.0
      loads[dept] = Math.round((0.1 + Math.random() * 0.9) * 100) / 100;
    });
    
    return loads;
  }

  /**
   * Generate a random patient with realistic attributes
   */
  private generatePatient(): PatientFactors {
    // Current time
    const now = new Date();
    // Random time in the past (0-3 hours ago)
    const arrivalTime = new Date(now.getTime() - this.randomInt(0, 180) * 60 * 1000);
    
    // 30% of patients have appointments
    const hasAppointment = Math.random() < 0.3;
    let appointmentTime: Date | null = null;
    
    if (hasAppointment) {
      // Appointment could be before or after arrival (missed appointments are common)
      const minutesDifference = this.randomInt(-60, 60); // -1 hour to +1 hour
      appointmentTime = new Date(arrivalTime.getTime() + minutesDifference * 60 * 1000);
    }
    
    // Random appointment type with distribution
    const appointmentTypeRandom = Math.random();
    let appointmentType: string;
    
    if (appointmentTypeRandom < 0.6) {
      appointmentType = 'regular';
    } else if (appointmentTypeRandom < 0.8) {
      appointmentType = 'follow-up';
    } else if (appointmentTypeRandom < 0.95) {
      appointmentType = 'specialist';
    } else {
      appointmentType = 'urgent';
    }
    
    // Random age group with distribution
    const ageGroupRandom = Math.random();
    let ageGroup: string;
    
    if (ageGroupRandom < 0.2) {
      ageGroup = 'child';
    } else if (ageGroupRandom < 0.7) {
      ageGroup = 'adult';
    } else {
      ageGroup = 'senior';
    }
    
    // Special needs are less common
    const specialNeeds = Math.random() < 0.15;
    
    // Urgency level distribution skews towards lower urgency
    let urgencyLevel: number;
    const urgencyRandom = Math.random();
    
    if (urgencyRandom < 0.5) {
      urgencyLevel = 1; // Most common
    } else if (urgencyRandom < 0.75) {
      urgencyLevel = 2;
    } else if (urgencyRandom < 0.9) {
      urgencyLevel = 3;
    } else if (urgencyRandom < 0.98) {
      urgencyLevel = 4;
    } else {
      urgencyLevel = 5; // Least common
    }
    
    // For urgent appointment type, increase urgency level
    if (appointmentType === 'urgent' && urgencyLevel < 3) {
      urgencyLevel = Math.min(5, urgencyLevel + this.randomInt(2, 3));
    }
    
    // Estimated procedure time depends on appointment type and urgency
    let baseProcedureTime: number;
    
    switch (appointmentType) {
      case 'regular':
        baseProcedureTime = this.randomInt(10, 30);
        break;
      case 'follow-up':
        baseProcedureTime = this.randomInt(15, 45);
        break;
      case 'specialist':
        baseProcedureTime = this.randomInt(30, 60);
        break;
      case 'urgent':
        baseProcedureTime = this.randomInt(20, 90);
        break;
      default:
        baseProcedureTime = this.randomInt(15, 45);
    }
    
    // Adjust procedure time based on urgency and special needs
    const urgencyFactor = urgencyLevel >= 4 ? 1.5 : 1.0;
    const specialNeedsFactor = specialNeeds ? 1.3 : 1.0;
    const estimatedProcedureTime = Math.round(baseProcedureTime * urgencyFactor * specialNeedsFactor);
    
    // Previous wait history (some patients might be new)
    const hasPreviousHistory = Math.random() < 0.7;
    const previousWaitHistory = hasPreviousHistory ? this.randomInt(5, 60) : undefined;
    
    return {
      urgencyLevel,
      appointmentType,
      ageGroup,
      specialNeeds,
      appointmentTime: appointmentTime || undefined,
      arrivalTime,
      estimatedProcedureTime,
      previousWaitHistory
    };
  }

  /**
   * Generate a random facility state
   */
  private generateFacilityState(): FacilityState {
    // Random number of patients between 5 and max
    const currentPatientCount = this.randomInt(5, this.config.maxPatients);
    
    // Peak hours are typically 9-11 AM and 1-3 PM
    const now = new Date();
    const hour = now.getHours();
    const peakHours = (hour >= 9 && hour <= 11) || (hour >= 13 && hour <= 15);
    
    // Average processing time between 10 and 45 minutes
    const averageProcessingTime = this.randomInt(10, 45);
    
    // Generate resource availability
    const resources: ResourceAvailability = {
      doctors: this.randomInt(1, this.config.maxDoctors),
      nurses: this.randomInt(Math.ceil(this.config.maxNurses / 2), this.config.maxNurses),
      rooms: this.randomInt(Math.ceil(this.config.maxRooms / 2), this.config.maxRooms),
      specialEquipment: this.generateSpecialEquipment()
    };
    
    return {
      currentPatientCount,
      averageProcessingTime,
      peakHours,
      resources,
      departmentLoads: this.generateDepartmentLoads()
    };
  }

  /**
   * Calculate a realistic wait time based on patient factors and facility state
   */
  private calculateRealisticWaitTime(patient: PatientFactors, facility: FacilityState): number {
    // Base wait time calculation
    let waitTime = 15; // Minimum wait time
    
    // Add wait time based on number of patients
    waitTime += facility.currentPatientCount * this.config.weights.patientCount;
    
    // Reduce wait time based on available resources
    const doctorFactor = Math.max(0, this.config.weights.doctorAvailability * (1 - facility.resources.doctors / this.config.maxDoctors));
    const nurseFactor = Math.max(0, this.config.weights.nurseAvailability * (1 - facility.resources.nurses / this.config.maxNurses));
    const roomFactor = Math.max(0, this.config.weights.roomAvailability * (1 - facility.resources.rooms / this.config.maxRooms));
    
    waitTime += doctorFactor + nurseFactor + roomFactor;
    
    // Peak hours increase wait time
    if (facility.peakHours) {
      waitTime += this.config.weights.peakHour;
    }
    
    // Procedure time affects wait time
    waitTime += patient.estimatedProcedureTime * this.config.weights.procedureTime;
    
    // Urgency level reduces wait time (higher urgency = lower wait)
    waitTime -= (patient.urgencyLevel - 1) * this.config.weights.urgency;
    
    // Special needs might increase wait time
    if (patient.specialNeeds) {
      waitTime += this.config.weights.specialNeeds;
    }
    
    // Appointment type affects wait time
    waitTime += this.config.weights.appointmentType[patient.appointmentType] || 0;
    
    // Age group affects wait time
    waitTime += this.config.weights.ageGroup[patient.ageGroup] || 0;
    
    // If the patient has an appointment, adjust wait time
    if (patient.appointmentTime) {
      const timeDifferenceMs = patient.arrivalTime.getTime() - patient.appointmentTime.getTime();
      const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);
      
      // If arrived early, reduce wait time
      if (timeDifferenceMinutes < -15) {
        waitTime *= 0.8;
      }
      // If arrived late, increase wait time
      else if (timeDifferenceMinutes > 15) {
        waitTime *= 1.3;
      }
    }
    
    // Add some randomness to simulate real-world variations
    const randomFactor = this.randomInt(80, 120) / 100;
    waitTime *= randomFactor;
    
    // Ensure wait time is at least 5 minutes and not exceeding the maximum
    return Math.min(Math.max(Math.round(waitTime), 5), this.config.maxWaitTime);
  }

  /**
   * Generate a batch of training data for the ML model
   */
  public generateTrainingData(count: number = 1000): Array<{
    patient: PatientFactors;
    facility: FacilityState;
    actualWaitTime: number;
  }> {
    const trainingData = [];
    
    for (let i = 0; i < count; i++) {
      const patient = this.generatePatient();
      const facility = this.generateFacilityState();
      const actualWaitTime = this.calculateRealisticWaitTime(patient, facility);
      
      trainingData.push({
        patient,
        facility,
        actualWaitTime
      });
    }
    
    return trainingData;
  }

  /**
   * Generate a patient dataset with current wait times
   */
  public generatePatientDataset(count: number = 50): Array<{
    id: string;
    factors: PatientFactors;
    currentWaitTime: number;
  }> {
    const patients = [];
    
    for (let i = 0; i < count; i++) {
      const factors = this.generatePatient();
      
      // Random wait time so far (0-60 minutes)
      const currentWaitTime = this.randomInt(0, 60);
      
      patients.push({
        id: `patient_${i}`,
        factors,
        currentWaitTime
      });
    }
    
    return patients;
  }
} 
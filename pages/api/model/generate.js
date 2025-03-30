// Next.js API Route for patient sample generation
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { count = 1, forQueue = false } = req.body;
    
    // Validate input
    const patientCount = Math.min(Math.max(1, parseInt(count)), 50);
    
    // Department options
    const departments = ['General', 'Emergency', 'Pediatrics', 'Cardiology', 'Orthopedics'];
    
    // Status options with weights for forQueue=true
    const queueStatuses = ['waiting', 'in-progress'];
    
    // Status options with weights for forQueue=false (include completed patients for metrics)
    const allStatuses = ['waiting', 'in-progress', 'completed', 'cancelled', 'no-show'];
    
    // Patient priority levels
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    
    // Common symptoms by department
    const symptomsByDepartment = {
      'General': ['fever', 'cough', 'fatigue', 'headache', 'sore throat', 'nausea'],
      'Emergency': ['chest pain', 'shortness of breath', 'severe abdominal pain', 'trauma', 'unconsciousness'],
      'Pediatrics': ['fever', 'ear pain', 'runny nose', 'cough', 'rash', 'vomiting', 'diarrhea'],
      'Cardiology': ['chest pain', 'palpitations', 'shortness of breath', 'fatigue', 'dizziness'],
      'Orthopedics': ['joint pain', 'back pain', 'fracture', 'sprain', 'swelling', 'limited mobility']
    };
    
    // Common first names
    const firstNames = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 'Jessica', 'Sarah'];
    
    // Common last names
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    
    // Generate random patients
    const patients = [];
    
    for (let i = 0; i < patientCount; i++) {
      // Random selections
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = Math.floor(Math.random() * 80) + 1;
      const gender = Math.random() > 0.5 ? 'Male' : 'Female';
      const department = departments[Math.floor(Math.random() * departments.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // Create phone number
      const areaCode = Math.floor(Math.random() * 900) + 100;
      const prefix = Math.floor(Math.random() * 900) + 100;
      const lineNumber = Math.floor(Math.random() * 9000) + 1000;
      const contactNumber = `(${areaCode}) ${prefix}-${lineNumber}`;
      
      // Create email (for some patients)
      const email = Math.random() > 0.3 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com` : undefined;
      
      // Get random symptoms for department
      const departmentSymptoms = symptomsByDepartment[department];
      const symptomCount = Math.floor(Math.random() * 3) + 1;
      const shuffledSymptoms = [...departmentSymptoms].sort(() => 0.5 - Math.random());
      const symptoms = shuffledSymptoms.slice(0, symptomCount).join(', ');
      
      // Determine status
      const status = forQueue 
        ? queueStatuses[Math.floor(Math.random() * queueStatuses.length)]
        : allStatuses[Math.floor(Math.random() * allStatuses.length)];
      
      // Create timestamps
      const now = new Date();
      const hoursAgo = Math.floor(Math.random() * 6);
      const minutesAgo = Math.floor(Math.random() * 60);
      const arrivalTime = new Date(now.getTime() - ((hoursAgo * 60 + minutesAgo) * 60 * 1000));
      
      let startTime = undefined;
      let endTime = undefined;
      
      if (status === 'in-progress') {
        const progressMinutesAgo = Math.floor(Math.random() * minutesAgo);
        startTime = new Date(now.getTime() - (progressMinutesAgo * 60 * 1000)).toISOString();
      } else if (status === 'completed' || status === 'cancelled' || status === 'no-show') {
        const progressMinutesAgo = Math.floor(Math.random() * minutesAgo);
        const processTime = Math.floor(Math.random() * 30) + 5; // 5-35 minutes processing time
        startTime = new Date(now.getTime() - ((progressMinutesAgo + processTime) * 60 * 1000)).toISOString();
        endTime = new Date(now.getTime() - (progressMinutesAgo * 60 * 1000)).toISOString();
      }
      
      // Calculate estimated wait time (minutes) based on priority
      const estimatedBaseTime = {
        'Low': 60,
        'Medium': 40,
        'High': 20,
        'Critical': 5
      };
      
      const estimatedWaitTime = Math.floor(estimatedBaseTime[priority] * (0.8 + Math.random() * 0.4));
      
      // Calculate estimated procedure time
      const estimatedProcedureTime = Math.floor(Math.random() * 30) + 10; // 10-40 minutes
      
      // Calculate actual wait time if applicable
      let actualWaitTime = undefined;
      if (startTime) {
        const waitMilliseconds = new Date(startTime).getTime() - arrivalTime.getTime();
        actualWaitTime = Math.floor(waitMilliseconds / (60 * 1000));
      }
      
      // Calculate actual procedure time if applicable
      let actualProcedureTime = undefined;
      if (startTime && endTime) {
        const procedureMilliseconds = new Date(endTime).getTime() - new Date(startTime).getTime();
        actualProcedureTime = Math.floor(procedureMilliseconds / (60 * 1000));
      }
      
      // Create patient object
      const patient = {
        id: `P${Date.now().toString().slice(-6)}${i}`,
        firstName,
        lastName,
        age,
        gender,
        contactNumber,
        email,
        symptoms,
        department,
        priority,
        status,
        arrivalTime: arrivalTime.toISOString(),
        startTime,
        endTime,
        estimatedWaitTime,
        estimatedProcedureTime,
        actualWaitTime,
        actualProcedureTime
      };
      
      patients.push(patient);
    }
    
    return res.status(200).json({
      success: true,
      data: patients,
      message: `Successfully generated ${patientCount} sample patient${patientCount > 1 ? 's' : ''}`
    });
  } catch (error) {
    console.error('Error generating patient samples:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

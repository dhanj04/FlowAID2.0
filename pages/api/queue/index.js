// Next.js API Route for queue patients
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const departmentFilter = req.query.department;
    
    // In a real app, this would fetch actual patients from a database
    // For now, we'll return mock data
    const mockPatients = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        age: 45,
        gender: 'Male',
        contactNumber: '555-123-4567',
        email: 'john.doe@example.com',
        symptoms: 'Chest pain, shortness of breath',
        department: 'Emergency',
        priority: 'high',
        status: 'in-progress',
        arrivalTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
        startTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        estimatedWaitTime: 30,
        estimatedProcedureTime: 60
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 32,
        gender: 'Female',
        contactNumber: '555-987-6543',
        email: 'jane.smith@example.com',
        symptoms: 'Fever, sore throat',
        department: 'General',
        priority: 'medium',
        status: 'waiting',
        arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        estimatedWaitTime: 45,
        estimatedProcedureTime: 30
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        age: 8,
        gender: 'Male',
        contactNumber: '555-456-7890',
        email: 'parent@example.com',
        symptoms: 'Ear pain',
        department: 'Pediatrics',
        priority: 'medium',
        status: 'waiting',
        arrivalTime: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
        estimatedWaitTime: 35,
        estimatedProcedureTime: 25
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Wilson',
        age: 65,
        gender: 'Female',
        contactNumber: '555-789-0123',
        email: 'emily.wilson@example.com',
        symptoms: 'Joint pain, difficulty walking',
        department: 'Orthopedics',
        priority: 'low',
        status: 'waiting',
        arrivalTime: new Date(Date.now() - 60 * 60000).toISOString(), // 60 minutes ago
        estimatedWaitTime: 50,
        estimatedProcedureTime: 45
      },
      {
        id: '5',
        firstName: 'Robert',
        lastName: 'Brown',
        age: 72,
        gender: 'Male',
        contactNumber: '555-234-5678',
        email: 'robert.brown@example.com',
        symptoms: 'Irregular heartbeat, dizziness',
        department: 'Cardiology',
        priority: 'high',
        status: 'waiting',
        arrivalTime: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
        estimatedWaitTime: 20,
        estimatedProcedureTime: 40
      },
      {
        id: '6',
        firstName: 'Sarah',
        lastName: 'Davis',
        age: 28,
        gender: 'Female',
        contactNumber: '555-345-6789',
        email: 'sarah.davis@example.com',
        symptoms: 'Abdominal pain, nausea',
        department: 'Emergency',
        priority: 'medium',
        status: 'completed',
        arrivalTime: new Date(Date.now() - 120 * 60000).toISOString(), // 120 minutes ago
        startTime: new Date(Date.now() - 90 * 60000).toISOString(), // 90 minutes ago
        endTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        actualWaitTime: 30,
        actualProcedureTime: 60
      }
    ];
    
    // Filter by department if specified
    let filteredPatients = mockPatients;
    if (departmentFilter) {
      filteredPatients = mockPatients.filter(
        patient => patient.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    return res.status(200).json({ 
      success: true, 
      data: filteredPatients
    });
  } catch (error) {
    console.error('Error fetching queue patients:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving queue patients' 
    });
  }
}

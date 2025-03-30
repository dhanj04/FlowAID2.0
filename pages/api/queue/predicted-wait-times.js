// Next.js API Route for predicted wait times
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const departmentFilter = req.query.department;
    
    // In a real app, this would fetch actual predictions from a model
    // For now, we'll return mock data
    const waitTimes = [
      {
        department: 'Emergency',
        currentWaitTime: 45, // minutes
        predictedWaitTime: 52, // minutes
        confidence: 0.85,
        factors: {
          patientVolume: 'high',
          staffAvailability: 'medium',
          timeOfDay: 'peak',
          dayOfWeek: 'weekday'
        }
      },
      {
        department: 'General',
        currentWaitTime: 30, // minutes
        predictedWaitTime: 35, // minutes
        confidence: 0.92,
        factors: {
          patientVolume: 'medium',
          staffAvailability: 'high',
          timeOfDay: 'standard',
          dayOfWeek: 'weekday'
        }
      },
      {
        department: 'Pediatrics',
        currentWaitTime: 25, // minutes
        predictedWaitTime: 20, // minutes
        confidence: 0.88,
        factors: {
          patientVolume: 'low',
          staffAvailability: 'high',
          timeOfDay: 'standard',
          dayOfWeek: 'weekday'
        }
      },
      {
        department: 'Orthopedics',
        currentWaitTime: 40, // minutes
        predictedWaitTime: 45, // minutes
        confidence: 0.82,
        factors: {
          patientVolume: 'medium',
          staffAvailability: 'medium',
          timeOfDay: 'standard',
          dayOfWeek: 'weekday'
        }
      },
      {
        department: 'Cardiology',
        currentWaitTime: 20, // minutes
        predictedWaitTime: 25, // minutes
        confidence: 0.90,
        factors: {
          patientVolume: 'low',
          staffAvailability: 'high',
          timeOfDay: 'standard',
          dayOfWeek: 'weekday'
        }
      }
    ];
    
    // Filter by department if specified
    let filteredWaitTimes = waitTimes;
    if (departmentFilter) {
      filteredWaitTimes = waitTimes.filter(
        time => time.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    return res.status(200).json({ 
      success: true, 
      data: {
        waitTimes: filteredWaitTimes,
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes from now
      }
    });
  } catch (error) {
    console.error('Error fetching predicted wait times:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving predicted wait times' 
    });
  }
}

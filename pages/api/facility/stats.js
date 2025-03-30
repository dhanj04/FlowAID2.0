// Next.js API Route for facility statistics
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // In a real application, this would fetch from a database
    // For mock purposes, return static statistics
    const facilityStats = {
      patientsServed: 1248,
      averageWaitTime: 28.5,
      currentCapacity: 85,
      maxCapacity: 120,
      utilizationRate: 0.71,
      departmentStats: {
        'Emergency': {
          patientsServed: 382,
          averageWaitTime: 18.3,
          utilizationRate: 0.85
        },
        'General': {
          patientsServed: 415,
          averageWaitTime: 32.7,
          utilizationRate: 0.68
        },
        'Pediatrics': {
          patientsServed: 176,
          averageWaitTime: 24.1,
          utilizationRate: 0.62
        },
        'Cardiology': {
          patientsServed: 125,
          averageWaitTime: 36.4,
          utilizationRate: 0.73
        },
        'Orthopedics': {
          patientsServed: 150,
          averageWaitTime: 31.2,
          utilizationRate: 0.66
        }
      }
    };
    
    return res.status(200).json({ 
      success: true, 
      data: facilityStats 
    });
  } catch (error) {
    console.error('Error fetching facility statistics:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

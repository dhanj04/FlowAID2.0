// Next.js API Route for fetching current queue data
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // In a real app, this would fetch actual queue data from a database
    // For now, we'll return mock data
    const queueData = {
      totalPatients: 42,
      averageWaitTime: 35, // minutes
      departments: {
        emergency: {
          count: 15,
          waitTime: 45,
          priority: 'high'
        },
        general: {
          count: 12,
          waitTime: 30,
          priority: 'medium'
        },
        pediatrics: {
          count: 8,
          waitTime: 25,
          priority: 'medium'
        },
        radiology: {
          count: 7,
          waitTime: 40,
          priority: 'low'
        }
      },
      recentActivity: [
        {
          id: '1',
          patientId: 'P-12345',
          action: 'added',
          department: 'emergency',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString() // 5 minutes ago
        },
        {
          id: '2',
          patientId: 'P-12346',
          action: 'completed',
          department: 'general',
          timestamp: new Date(Date.now() - 8 * 60000).toISOString() // 8 minutes ago
        },
        {
          id: '3',
          patientId: 'P-12347',
          action: 'transferred',
          department: 'pediatrics',
          newDepartment: 'radiology',
          timestamp: new Date(Date.now() - 12 * 60000).toISOString() // 12 minutes ago
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    return res.status(200).json({ 
      success: true, 
      data: queueData
    });
  } catch (error) {
    console.error('Error fetching queue data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving queue data' 
    });
  }
}

// Next.js API Route for queue statistics
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const departmentFilter = req.query.department;
    
    // In a real app, this would fetch actual statistics from a database
    // For now, we'll return mock data
    let statistics = {
      totalPatients: 156,
      averageWaitTime: 32, // minutes
      peakHours: [
        { hour: 9, count: 24 },
        { hour: 10, count: 31 },
        { hour: 11, count: 28 },
        { hour: 14, count: 22 },
        { hour: 15, count: 26 }
      ],
      departmentBreakdown: [
        { department: 'Emergency', count: 42, percentage: 26.9 },
        { department: 'General', count: 38, percentage: 24.4 },
        { department: 'Pediatrics', count: 27, percentage: 17.3 },
        { department: 'Orthopedics', count: 21, percentage: 13.5 },
        { department: 'Cardiology', count: 18, percentage: 11.5 },
        { department: 'Other', count: 10, percentage: 6.4 }
      ],
      statusBreakdown: [
        { status: 'waiting', count: 68, percentage: 43.6 },
        { status: 'in-progress', count: 45, percentage: 28.8 },
        { status: 'completed', count: 35, percentage: 22.4 },
        { status: 'cancelled', count: 5, percentage: 3.2 },
        { status: 'no-show', count: 3, percentage: 1.9 }
      ],
      trends: {
        daily: [
          { day: 'Monday', count: 145 },
          { day: 'Tuesday', count: 132 },
          { day: 'Wednesday', count: 156 },
          { day: 'Thursday', count: 142 },
          { day: 'Friday', count: 168 },
          { day: 'Saturday', count: 112 },
          { day: 'Sunday', count: 89 }
        ],
        weekly: [
          { week: 'Week 1', count: 823 },
          { week: 'Week 2', count: 856 },
          { week: 'Week 3', count: 912 },
          { week: 'Week 4', count: 944 }
        ]
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Filter by department if specified
    if (departmentFilter) {
      // In a real app, we would query the database with the filter
      // For mock data, we'll just adjust the numbers
      statistics = {
        ...statistics,
        totalPatients: 42,
        averageWaitTime: departmentFilter === 'Emergency' ? 45 : 28,
        peakHours: statistics.peakHours.map(hour => ({ 
          ...hour, 
          count: Math.floor(hour.count * 0.3) 
        })),
        statusBreakdown: statistics.statusBreakdown.map(status => ({
          ...status,
          count: Math.floor(status.count * 0.3),
          percentage: status.percentage // Keep percentages the same for simplicity
        }))
      };
    }
    
    return res.status(200).json({ 
      success: true, 
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching queue statistics:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving queue statistics' 
    });
  }
}

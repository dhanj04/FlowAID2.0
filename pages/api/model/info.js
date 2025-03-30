// Next.js API Route for model information
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // In a real application, this would fetch from a database
    // For mock purposes, return static model information
    const modelInfo = {
      version: '1.2.0',
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      accuracy: 0.87,
      parameters: {
        waitTimeFactors: {
          patientVolume: 0.4,
          staffAvailability: 0.3,
          priorityWeight: 0.2,
          timeOfDay: 0.1
        },
        resourceAllocation: {
          doctors: 0.35,
          nurses: 0.35,
          rooms: 0.3
        }
      }
    };
    
    return res.status(200).json({ 
      success: true, 
      data: modelInfo 
    });
  } catch (error) {
    console.error('Error fetching model info:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Next.js API Route for facility processing times
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real application, this would fetch from a database
      // For mock purposes, return static processing times information
      const processingTimes = {
        General: {
          averageTime: 25,
          minimumTime: 15,
          maximumTime: 40
        },
        Emergency: {
          averageTime: 40,
          minimumTime: 20,
          maximumTime: 60
        },
        Pediatrics: {
          averageTime: 30,
          minimumTime: 20,
          maximumTime: 45
        },
        Cardiology: {
          averageTime: 45,
          minimumTime: 30,
          maximumTime: 70
        },
        Orthopedics: {
          averageTime: 35,
          minimumTime: 25,
          maximumTime: 55
        }
      };
      
      return res.status(200).json({ 
        success: true, 
        data: processingTimes 
      });
    } catch (error) {
      console.error('Error fetching processing times:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      // In a real application, this would update a database
      // For mock purposes, just return the received data
      const updatedTimes = req.body.processingTimes || req.body;
      
      return res.status(200).json({ 
        success: true, 
        data: updatedTimes,
        message: 'Processing times updated successfully'
      });
    } catch (error) {
      console.error('Error updating processing times:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

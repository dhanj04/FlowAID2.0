// Next.js API Route for facility state
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real application, this would fetch from a database
      // For mock purposes, return static state information
      const facilityState = {
        isOpen: true,
        currentStatus: 'normal',
        message: 'Operating normally',
        resources: {
          doctors: 12,
          nurses: 28,
          rooms: 15,
          equipment: {
            xray: 3,
            mri: 1,
            ultrasound: 2
          }
        },
        departmentLoads: {
          General: 6.2,
          Emergency: 8.5,
          Pediatrics: 4.8,
          Cardiology: 5.3,
          Orthopedics: 4.1
        },
        averageProcessingTimes: {
          General: 25,
          Emergency: 40,
          Pediatrics: 30,
          Cardiology: 45,
          Orthopedics: 35
        }
      };
      
      return res.status(200).json({ 
        success: true, 
        data: facilityState 
      });
    } catch (error) {
      console.error('Error fetching facility state:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      // In a real application, this would update a database
      // For mock purposes, just return the received data
      const updatedState = req.body;
      
      return res.status(200).json({ 
        success: true, 
        data: updatedState,
        message: 'Facility state updated successfully'
      });
    } catch (error) {
      console.error('Error updating facility state:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

// Next.js API Route for facility resources
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real application, this would fetch from a database
      // For mock purposes, return static resources information
      const facilityResources = {
        doctors: 12,
        nurses: 28,
        rooms: 15,
        equipment: {
          xray: 3,
          mri: 1,
          ultrasound: 2
        }
      };
      
      return res.status(200).json({ 
        success: true, 
        data: facilityResources 
      });
    } catch (error) {
      console.error('Error fetching facility resources:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      // In a real application, this would update a database
      // For mock purposes, just return the received data
      const updatedResources = req.body;
      
      return res.status(200).json({ 
        success: true, 
        data: updatedResources,
        message: 'Facility resources updated successfully'
      });
    } catch (error) {
      console.error('Error updating facility resources:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

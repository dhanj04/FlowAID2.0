// Next.js API Route for department loads
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real application, this would fetch from a database
      // For mock purposes, return static department loads
      const departmentLoads = {
        General: 6.2,
        Emergency: 8.5,
        Pediatrics: 4.8,
        Cardiology: 5.3,
        Orthopedics: 4.1
      };
      
      return res.status(200).json({ 
        success: true, 
        data: departmentLoads 
      });
    } catch (error) {
      console.error('Error fetching department loads:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      // In a real application, this would update a database
      // For mock purposes, just return the received data
      const updatedLoads = req.body;
      
      return res.status(200).json({ 
        success: true, 
        data: updatedLoads,
        message: 'Department loads updated successfully'
      });
    } catch (error) {
      console.error('Error updating department loads:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

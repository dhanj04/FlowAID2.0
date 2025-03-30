// Next.js API Route for generating sample patient data
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { count = 10, addToQueue = false } = req.body;
    
    // In a real app, this would generate actual patient data
    // For now, we'll return a success message
    
    return res.status(200).json({ 
      success: true, 
      message: `Generated ${count} sample patients${addToQueue ? ' and added to queue' : ''}`,
      samples: Array.from({ length: count }, (_, i) => ({
        id: `sample-${Date.now()}-${i}`,
        name: `Patient ${i + 1}`,
        age: Math.floor(Math.random() * 80) + 18,
        symptoms: ['fever', 'cough', 'fatigue'].slice(0, Math.floor(Math.random() * 3) + 1),
        generatedAt: new Date().toISOString()
      }))
    });
  } catch (error) {
    console.error('Error generating samples:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error generating sample patients' 
    });
  }
}

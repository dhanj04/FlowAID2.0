// Next.js API Route for adding demo patients to the queue
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { count = 5 } = req.body;
    
    // Call the model API to generate sample patients
    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/model/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count, forQueue: true }),
    });

    const generatedData = await generateResponse.json();
    
    if (!generatedData.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate sample patients' 
      });
    }

    // For a real application, this would add the patients to a database
    // Here we're just returning the generated patients
    return res.status(200).json({
      success: true,
      data: generatedData.data,
      message: `Successfully added ${count} demo patients to the queue`
    });
  } catch (error) {
    console.error('Error adding demo patients:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

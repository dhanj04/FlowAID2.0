// Next.js API Route for diagnosis prediction
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { symptoms } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid symptoms array is required' 
      });
    }
    
    // Map common symptoms to potential diagnoses (simplified mock)
    const diagnosisMap = {
      'fever': [
        { condition: 'Common Cold', probability: 0.45 },
        { condition: 'Influenza', probability: 0.35 },
        { condition: 'COVID-19', probability: 0.15 },
        { condition: 'Bacterial Infection', probability: 0.05 }
      ],
      'cough': [
        { condition: 'Common Cold', probability: 0.40 },
        { condition: 'Bronchitis', probability: 0.25 },
        { condition: 'Asthma', probability: 0.20 },
        { condition: 'COVID-19', probability: 0.15 }
      ],
      'headache': [
        { condition: 'Tension Headache', probability: 0.50 },
        { condition: 'Migraine', probability: 0.30 },
        { condition: 'Sinus Infection', probability: 0.15 },
        { condition: 'Dehydration', probability: 0.05 }
      ],
      'nausea': [
        { condition: 'Food Poisoning', probability: 0.35 },
        { condition: 'Gastroenteritis', probability: 0.30 },
        { condition: 'Migraine', probability: 0.20 },
        { condition: 'Pregnancy', probability: 0.15 }
      ],
      'fatigue': [
        { condition: 'Anemia', probability: 0.25 },
        { condition: 'Depression', probability: 0.25 },
        { condition: 'Sleep Disorder', probability: 0.25 },
        { condition: 'Chronic Fatigue Syndrome', probability: 0.25 }
      ],
      'dizziness': [
        { condition: 'Vertigo', probability: 0.40 },
        { condition: 'Low Blood Pressure', probability: 0.30 },
        { condition: 'Anemia', probability: 0.20 },
        { condition: 'Inner Ear Infection', probability: 0.10 }
      ],
      'chest pain': [
        { condition: 'Anxiety', probability: 0.30 },
        { condition: 'Acid Reflux', probability: 0.30 },
        { condition: 'Muscle Strain', probability: 0.25 },
        { condition: 'Angina', probability: 0.15 }
      ],
      'shortness of breath': [
        { condition: 'Anxiety', probability: 0.35 },
        { condition: 'Asthma', probability: 0.30 },
        { condition: 'Bronchitis', probability: 0.20 },
        { condition: 'Pneumonia', probability: 0.15 }
      ]
    };
    
    // Process symptoms and generate diagnosis
    let diagnosisCounts = {};
    let totalWeight = 0;
    
    // Normalize symptoms (lowercase, trim)
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
    
    // Count diagnoses across all symptoms
    normalizedSymptoms.forEach(symptom => {
      if (diagnosisMap[symptom]) {
        diagnosisMap[symptom].forEach(diagnosis => {
          if (!diagnosisCounts[diagnosis.condition]) {
            diagnosisCounts[diagnosis.condition] = 0;
          }
          diagnosisCounts[diagnosis.condition] += diagnosis.probability;
          totalWeight += diagnosis.probability;
        });
      }
    });
    
    // Convert to array and sort by probability
    const diagnoses = Object.entries(diagnosisCounts).map(([condition, weight]) => ({
      condition,
      probability: Number((weight / totalWeight).toFixed(2))
    })).sort((a, b) => b.probability - a.probability).slice(0, 5);
    
    // Generate recommendation based on top diagnosis
    let recommendation = '';
    if (diagnoses.length > 0) {
      const topCondition = diagnoses[0].condition;
      
      if (topCondition === 'Common Cold' || topCondition === 'Influenza') {
        recommendation = 'Rest, stay hydrated, and take over-the-counter medications for symptom relief. Consult a doctor if symptoms worsen or persist beyond 7 days.';
      } else if (topCondition === 'COVID-19') {
        recommendation = 'Please get tested for COVID-19 and self-isolate until you receive your results. Contact your healthcare provider for guidance.';
      } else if (topCondition === 'Migraine' || topCondition === 'Tension Headache') {
        recommendation = 'Rest in a quiet, dark room. Try over-the-counter pain relievers. Consult a doctor if headaches are severe or recurring.';
      } else if (topCondition === 'Anxiety') {
        recommendation = 'Practice deep breathing exercises and relaxation techniques. Consider speaking with a mental health professional.';
      } else {
        recommendation = 'Based on your symptoms, we recommend consulting with a healthcare professional for a proper diagnosis and treatment plan.';
      }
    } else {
      recommendation = 'Unable to determine a diagnosis based on the provided symptoms. Please consult with a healthcare professional.';
    }
    
    return res.status(200).json({
      success: true,
      diagnoses,
      recommendation,
      disclaimer: 'This is an AI-generated prediction and should not replace professional medical advice.'
    });
  } catch (error) {
    console.error('Error generating diagnosis:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

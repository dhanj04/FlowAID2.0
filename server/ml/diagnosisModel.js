/**
 * This module provides an interface to the machine learning model for medical diagnosis.
 * In a production environment, this would integrate with an actual trained ML model.
 * For demonstration purposes, we're using a simplified implementation.
 */

// Common symptoms and their associated conditions (simplified for demo)
const symptomConditionMap = {
  'fever': ['Common Cold', 'Flu', 'COVID-19', 'Pneumonia'],
  'cough': ['Common Cold', 'Flu', 'COVID-19', 'Bronchitis', 'Pneumonia'],
  'headache': ['Common Cold', 'Flu', 'Migraine', 'Tension Headache', 'Sinusitis'],
  'fatigue': ['Common Cold', 'Flu', 'COVID-19', 'Anemia', 'Depression'],
  'nausea': ['Food Poisoning', 'Migraine', 'Pregnancy', 'Gastroenteritis'],
  'dizziness': ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Dehydration'],
  'shortness of breath': ['Asthma', 'COVID-19', 'Pneumonia', 'Heart Failure', 'Anxiety'],
  'chest pain': ['Heart Attack', 'Angina', 'Pneumonia', 'Acid Reflux', 'Anxiety'],
  'abdominal pain': ['Appendicitis', 'Gastritis', 'IBS', 'Kidney Stones', 'Food Poisoning'],
  'joint pain': ['Arthritis', 'Gout', 'Lupus', 'Lyme Disease', 'Fibromyalgia'],
  'muscle aches': ['Flu', 'COVID-19', 'Fibromyalgia', 'Lyme Disease'],
  'sore throat': ['Common Cold', 'Flu', 'Strep Throat', 'Tonsillitis'],
  'runny nose': ['Common Cold', 'Flu', 'Allergies', 'Sinusitis'],
  'rash': ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Chickenpox', 'Measles'],
  'vomiting': ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Pregnancy'],
  'diarrhea': ['Food Poisoning', 'Gastroenteritis', 'IBS', 'Crohn\'s Disease'],
  'back pain': ['Muscle Strain', 'Herniated Disc', 'Kidney Infection', 'Arthritis'],
  'loss of appetite': ['Depression', 'Anxiety', 'Gastritis', 'Hepatitis'],
  'chills': ['Flu', 'COVID-19', 'Pneumonia', 'Malaria'],
  'sweating': ['Flu', 'Menopause', 'Hyperthyroidism', 'Anxiety']
};

// Condition information database (simplified for demo)
const conditionDatabase = {
  'Common Cold': {
    description: 'A viral infectious disease of the upper respiratory tract that primarily affects the nose.',
    recommendations: [
      'Rest and drink plenty of fluids',
      'Over-the-counter pain relievers like acetaminophen',
      'Saline nasal spray to relieve congestion',
      'Consult a doctor if symptoms worsen or persist beyond 10 days'
    ]
  },
  'Flu': {
    description: 'An infectious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.',
    recommendations: [
      'Rest and stay hydrated',
      'Take over-the-counter fever reducers and pain relievers',
      'Stay home to avoid spreading the illness',
      'Consult a doctor for antiviral medications if diagnosed early'
    ]
  },
  'COVID-19': {
    description: 'A respiratory illness caused by the SARS-CoV-2 virus, which can range from mild to severe.',
    recommendations: [
      'Isolate to prevent spread to others',
      'Rest and stay hydrated',
      'Monitor your symptoms carefully',
      'Seek emergency medical care if you have trouble breathing'
    ]
  },
  'Allergies': {
    description: 'An allergic reaction to pollen or other substances in the environment that typically occurs during specific seasons.',
    recommendations: [
      'Over-the-counter antihistamines',
      'Avoid known allergens when possible',
      'Use air purifiers indoors',
      'Consult with an allergist for long-term management'
    ]
  },
  'Sinusitis': {
    description: 'Inflammation of the sinuses, which are air-filled cavities in the skull.',
    recommendations: [
      'Nasal decongestants and pain relievers',
      'Warm compresses on the face',
      'Saline nasal irrigation',
      'See a doctor if symptoms last more than 10 days or are severe'
    ]
  },
  'Migraine': {
    description: 'A neurological condition that causes severe, debilitating headaches, often accompanied by other symptoms.',
    recommendations: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compresses to your head or neck',
      'Take over-the-counter pain relievers',
      'Consult a doctor for prescription medications if migraines are frequent'
    ]
  }
};

/**
 * Predicts possible medical conditions based on symptoms using a simplified algorithm.
 * In a real application, this would use a trained machine learning model.
 * 
 * @param {string} symptomsText - Text describing symptoms
 * @param {string} duration - Duration of symptoms
 * @param {string} additionalInfo - Additional patient information
 * @returns {Object} Diagnosis result with possible conditions and recommendations
 */
const predictDiagnosis = async (symptomsText, duration, additionalInfo) => {
  // Parse symptoms from text
  const symptoms = symptomsText.toLowerCase().split(/[,.]\s*/);
  
  // Count condition occurrences based on symptoms
  const conditionCounts = {};
  const matchedSymptoms = [];
  
  // For each symptom, find matching conditions
  symptoms.forEach(symptom => {
    // Find the closest matching symptom in our database
    const matchedSymptom = Object.keys(symptomConditionMap).find(key => 
      symptom.includes(key) || key.includes(symptom)
    );
    
    if (matchedSymptom) {
      matchedSymptoms.push(matchedSymptom);
      const conditions = symptomConditionMap[matchedSymptom];
      
      conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
    }
  });
  
  // Calculate condition probabilities
  const totalMatchedSymptoms = matchedSymptoms.length;
  const possibleConditions = [];
  
  if (totalMatchedSymptoms > 0) {
    // Sort conditions by count (highest first)
    const sortedConditions = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Take top 3 conditions
    
    // Calculate probability and add condition details
    sortedConditions.forEach(([condition, count]) => {
      // Simple probability calculation (would be more sophisticated in a real model)
      const probability = Math.min(0.95, count / totalMatchedSymptoms);
      
      // Get condition details from database
      const details = conditionDatabase[condition] || {
        description: 'A medical condition that requires professional diagnosis.',
        recommendations: ['Consult with a healthcare professional for proper evaluation.']
      };
      
      possibleConditions.push({
        name: condition,
        probability,
        description: details.description,
        recommendations: details.recommendations
      });
    });
  }
  
  // If no conditions found, provide a generic response
  if (possibleConditions.length === 0) {
    possibleConditions.push({
      name: 'Unspecified Condition',
      probability: 0.5,
      description: 'Based on the provided symptoms, a specific condition could not be determined.',
      recommendations: [
        'Consult with a healthcare professional for proper evaluation',
        'Keep track of your symptoms and when they occur',
        'Note any factors that seem to trigger or worsen your symptoms'
      ]
    });
  }
  
  return {
    possibleConditions,
    disclaimer: 'This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment.'
  };
};

module.exports = {
  predictDiagnosis
};

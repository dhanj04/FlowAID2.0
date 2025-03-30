const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Import ML model (this would be your actual model in production)
const { predictDiagnosis } = require('../ml/diagnosisModel');

/**
 * @route   POST api/diagnosis
 * @desc    Get AI diagnosis based on symptoms
 * @access  Private (requires authentication)
 */
router.post(
  '/',
  [
    auth,
    body('symptoms', 'Symptoms are required').not().isEmpty(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { symptoms, duration, additionalInfo } = req.body;
      
      // In a production environment, this would call the actual ML model
      // For now, we'll use mock data to simulate the model response
      
      // This is where you would integrate with your trained ML model
      // const diagnosisResult = await predictDiagnosis(symptoms, duration, additionalInfo);
      
      // Mock diagnosis result for demonstration
      const mockDiagnosis = {
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: 0.85,
            description: 'A viral infectious disease of the upper respiratory tract that primarily affects the nose.',
            recommendations: [
              'Rest and drink plenty of fluids',
              'Over-the-counter pain relievers like acetaminophen',
              'Saline nasal spray to relieve congestion',
              'Consult a doctor if symptoms worsen or persist beyond 10 days'
            ]
          },
          {
            name: 'Seasonal Allergies',
            probability: 0.65,
            description: 'An allergic reaction to pollen or other substances in the environment that typically occurs during specific seasons.',
            recommendations: [
              'Over-the-counter antihistamines',
              'Avoid known allergens when possible',
              'Use air purifiers indoors',
              'Consult with an allergist for long-term management'
            ]
          },
          {
            name: 'Sinusitis',
            probability: 0.45,
            description: 'Inflammation of the sinuses, which are air-filled cavities in the skull.',
            recommendations: [
              'Nasal decongestants and pain relievers',
              'Warm compresses on the face',
              'Saline nasal irrigation',
              'See a doctor if symptoms last more than 10 days or are severe'
            ]
          }
        ],
        disclaimer: 'This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment.'
      };

      res.json(mockDiagnosis);
    } catch (err) {
      console.error('Error in diagnosis API:', err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

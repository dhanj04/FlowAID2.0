# flowAID - Healthcare Queue Optimization Platform

flowAID is an AI-powered healthcare queue management and optimization platform designed to reduce patient wait times, improve resource allocation, and enhance overall efficiency in healthcare facilities.

## Machine Learning Queue Optimization

The heart of flowAID is its machine learning-based queue optimization system, which:

- Predicts patient wait times based on multiple factors
- Prioritizes patients based on a sophisticated scoring algorithm
- Allocates resources (doctors, nurses, rooms) efficiently
- Adapts to facility conditions and peak hours

## Core Components

### Queue Optimization Model

The ML model in `models/QueueOptimizationModel.ts` provides:

- A deep neural network built with TensorFlow.js
- Priority scoring based on patient factors
- Wait time prediction
- Resource allocation optimization

### Training Data Generator

The synthetic data generator in `models/TrainingDataGenerator.ts`:

- Creates realistic patient scenarios
- Simulates facility states and resource availability
- Generates training data based on real-world patterns
- Helps train the model with large datasets

### Queue Service

The service layer in `services/QueueService.ts`:

- Manages the patient queue
- Communicates with Firebase for real-time updates
- Handles patient status transitions
- Monitors and updates facility resources

## Dashboard Features

The platform includes comprehensive visualizations and management tools:

- **Queue Analytics**: Charts and visualizations of wait times, resource utilization, and department loads
- **Patient Queue Management**: Real-time view and management of patients in the queue
- **Department-specific Views**: Filtered views for each hospital department
- **Add Patient Form**: Quick addition of new patients with all relevant factors

## Technical Stack

- **Frontend**: Next.js, React, TypeScript
- **Machine Learning**: TensorFlow.js
- **State Management**: React Hooks
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI Components**: Tailwind CSS, Headless UI, Heroicons
- **Visualizations**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key ML Model Features

### Patient Factors

The ML model considers these factors for prioritization:

- **Urgency Level**: Scale of 1-5 (5 being highest)
- **Appointment Type**: Regular, follow-up, specialist, or urgent
- **Age Group**: Child, adult, or senior
- **Special Needs**: Patients requiring additional assistance
- **Appointment Time**: For scheduled appointments
- **Arrival Time**: When the patient arrived
- **Estimated Procedure Time**: Expected duration of treatment

### Facility State

The model adapts to the current state of the facility:

- **Patient Count**: Number of patients currently in system
- **Resource Availability**: Doctors, nurses, rooms
- **Peak Hours**: Adjusts algorithm during busy periods
- **Department Loads**: Distribution of patients across departments

## Machine Learning Architecture

The neural network model consists of:

- Input layer with 10 features
- Hidden layers with 16, 32, and 16 neurons respectively
- ReLU activation functions
- Output layer for wait time prediction
- Mean squared error loss function
- Adam optimizer

## License

Copyright © 2023 flowAID. All rights reserved.

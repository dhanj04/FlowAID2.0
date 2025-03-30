# flowAID Project Structure

This document outlines the directory structure for the flowAID healthcare queue optimization system based on the architecture flowchart.

## Directory Structure

```
/
├── frontend/                  # Frontend application code
│   ├── components/            # React components
│   │   ├── ui/                # UI components (buttons, toggles, etc.)
│   │   └── functional/        # Functional components (forms, dashboards, etc.)
│   ├── pages/                 # Next.js pages
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # CSS and styling files
│   └── public/                # Static assets
│
├── backend/                   # Backend server code
│   ├── routes/                # API route handlers
│   ├── models/                # Server-side ML models
│   ├── controllers/           # Business logic controllers
│   ├── middleware/            # Express middleware
│   └── utils/                 # Utility functions
│
├── shared/                    # Shared code between frontend and backend
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # Shared constants
│   └── utils/                 # Shared utility functions
│
├── services/                  # Service layer
│   ├── api/                   # API service clients
│   ├── firebase/              # Firebase configuration and services
│   └── queue/                 # Queue management services
│
├── ml/                        # Machine Learning models
│   ├── client/                # Client-side ML models
│   ├── server/                # Server-side ML models
│   └── training/              # Training data and scripts
│
├── config/                    # Configuration files
│   ├── firebase/              # Firebase configuration
│   └── server/                # Server configuration
│
└── docs/                      # Documentation
    └── flowchart.md           # System architecture flowchart
```

## File Organization

### Frontend
- UI Components: Buttons, toggles, logos, navbar, footer
- Functional Components: Forms, dashboards, visualizations
- Pages: Main application pages and routing

### Backend
- Routes: API endpoints for authentication, patients, queue, facility, and model
- Models: Server-side ML models for queue optimization
- Controllers: Business logic for handling requests

### Services
- API Services: Client-side API communication
- Firebase Services: Firebase configuration and data access
- Queue Services: Queue management and optimization logic

### ML Models
- Client-side: Models that run in the browser
- Server-side: Models that run on the server
- Training: Data generation and model training scripts

This structure follows the architecture outlined in the flowchart while organizing files in a way that promotes separation of concerns and maintainability.
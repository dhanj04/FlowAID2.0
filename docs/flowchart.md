# flowAID Healthcare System Architecture Flowchart

## Application Overview

flowAID is a healthcare queue optimization system that uses AI/ML to prioritize patients and predict wait times. The application is built with Next.js and uses Firebase for data storage.

```mermaid
flowchart TD
    %% Main Application Flow
    Client[Client Browser] --> NextJS[Next.js Application]
    NextJS --> Pages[Pages]
    NextJS --> Components[Components]
    NextJS --> API[API Services]
    API --> Server[Backend Server]
    Server --> Firebase[(Firebase Database)]
    Server --> ML[ML Models]
    
    %% Pages Structure
    Pages --> IndexPage[index.tsx\nRedirect to Login/Dashboard]
    Pages --> LoginPage[login.tsx\nUser Authentication]
    Pages --> SignupPage[signup.tsx\nUser Registration]
    Pages --> DashboardPage[dashboard.tsx\nMain Application Dashboard]
    Pages --> DoctorDashboard[dashboard/doctor.tsx\nDoctor-specific View]
    Pages --> PatientDashboard[dashboard/patient.tsx\nPatient-specific View]
    Pages --> DoctorProfile[profile/doctor.tsx\nDoctor Profile Management]
    Pages --> PatientProfile[profile/patient.tsx\nPatient Profile Management]
    
    %% Components Structure
    Components --> UIComponents[UI Components]
    Components --> FunctionalComponents[Functional Components]
    
    UIComponents --> Navbar[Navbar.tsx]
    UIComponents --> Footer[Footer.tsx]
    UIComponents --> Button[Button.tsx]
    UIComponents --> DarkModeToggle[DarkModeToggle.tsx]
    UIComponents --> Logo[Logo.tsx]
    
    FunctionalComponents --> QueueDashboard[QueueDashboard.tsx\nQueue Management Interface]
    FunctionalComponents --> QueueVisualization[QueueVisualization.tsx\nVisual Queue Representation]
    FunctionalComponents --> AddPatientForm[AddPatientForm.tsx\nPatient Registration Form]
    
    %% Services
    API --> AuthAPI[AuthAPI\nAuthentication Services]
    API --> PatientAPI[PatientAPI\nPatient Management]
    API --> QueueAPI[QueueAPI\nQueue Operations]
    API --> FacilityAPI[FacilityAPI\nFacility Management]
    API --> ModelAPI[ModelAPI\nML Model Interactions]
    
    %% Server Structure
    Server --> ServerRoutes[Server Routes]
    Server --> ServerModels[Server Models]
    
    ServerRoutes --> AuthRoutes[auth.js\nAuthentication Endpoints]
    ServerRoutes --> PatientRoutes[patients.js\nPatient Endpoints]
    ServerRoutes --> QueueRoutes[queue.js\nQueue Management Endpoints]
    ServerRoutes --> FacilityRoutes[facility.js\nFacility Management]
    ServerRoutes --> ModelRoutes[model.js\nML Model Endpoints]
    
    ServerModels --> QueueOptimizationModelJS[QueueOptimizationModel.js\nServer-side ML Model]
    ServerModels --> TrainingDataGeneratorJS[TrainingDataGenerator.js\nTraining Data Generation]
    
    %% Client Models
    ML --> QueueOptimizationModelTS[QueueOptimizationModel.ts\nClient-side ML Model]
    ML --> TrainingDataGeneratorTS[TrainingDataGenerator.ts\nClient-side Data Generation]
    
    %% Services
    QueueService[QueueService.ts\nQueue Management Logic] --> QueueOptimizationModelTS
    QueueService --> Firebase
```

## Data Flow Diagram

```mermaid
flowchart LR
    %% User Interactions
    User([User]) --> Login[Login/Signup]
    Login --> Dashboard[Dashboard]
    
    %% Dashboard Actions
    Dashboard --> ViewQueue[View Queue]
    Dashboard --> AddPatient[Add Patient]
    Dashboard --> UpdatePatientStatus[Update Patient Status]
    Dashboard --> ViewFacilitySettings[View/Update Facility Settings]
    
    %% Data Flow for Queue Management
    AddPatient --> PatientAPI[PatientAPI]
    UpdatePatientStatus --> PatientAPI
    ViewQueue --> QueueAPI[QueueAPI]
    ViewFacilitySettings --> FacilityAPI[FacilityAPI]
    
    %% API to Server
    PatientAPI --> PatientRoutes[Patient Routes]
    QueueAPI --> QueueRoutes[Queue Routes]
    FacilityAPI --> FacilityRoutes[Facility Routes]
    
    %% Server Processing
    PatientRoutes --> Firebase[(Firebase)]
    QueueRoutes --> QueueOptimizationModel[Queue Optimization Model]
    QueueRoutes --> Firebase
    FacilityRoutes --> Firebase
    
    %% ML Model Processing
    QueueOptimizationModel --> PriorityCalculation[Calculate Priority Scores]
    QueueOptimizationModel --> WaitTimePrediction[Predict Wait Times]
    QueueOptimizationModel --> ResourceAllocation[Allocate Resources]
    
    %% Results Flow Back to User
    Firebase --> QueueRoutes
    PriorityCalculation --> QueueRoutes
    WaitTimePrediction --> QueueRoutes
    ResourceAllocation --> QueueRoutes
    QueueRoutes --> QueueAPI
    QueueAPI --> Dashboard
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Client as Client App
    participant AuthAPI
    participant Server
    participant Firebase
    
    %% Login Flow
    User->>Client: Enter Credentials
    Client->>AuthAPI: login(email, password)
    AuthAPI->>Server: POST /api/auth/login
    Server->>Firebase: Verify Credentials
    Firebase-->>Server: Authentication Result
    Server-->>AuthAPI: JWT Token + User Data
    AuthAPI-->>Client: Store Token in localStorage
    Client-->>User: Redirect to Dashboard
    
    %% Auth Check on Page Load
    User->>Client: Access Protected Page
    Client->>Client: Check localStorage for Token
    alt Token Exists
        Client->>AuthAPI: validateToken()
        AuthAPI->>Server: GET /api/auth/validate
        Server->>Firebase: Verify Token
        Firebase-->>Server: Token Valid
        Server-->>AuthAPI: Success
        AuthAPI-->>Client: Allow Access
    else No Token
        Client-->>User: Redirect to Login
    end
```

## Queue Optimization Process

```mermaid
flowchart TD
    %% Queue Optimization Process
    Start([Queue Update Triggered]) --> FetchPatients[Fetch Waiting Patients]
    FetchPatients --> FetchFacility[Fetch Facility State]
    FetchFacility --> ExtractFeatures[Extract Patient Features]
    ExtractFeatures --> CalculatePriority[Calculate Priority Scores]
    CalculatePriority --> PredictWaitTimes[Predict Wait Times]
    PredictWaitTimes --> AllocateResources[Allocate Resources]
    AllocateResources --> UpdateQueue[Update Queue in Database]
    UpdateQueue --> NotifyClients[Notify Connected Clients]
    NotifyClients --> End([End Process])
    
    %% Feature Extraction Detail
    ExtractFeatures --> UrgencyLevel[Urgency Level (1-5)]
    ExtractFeatures --> AppointmentType[Appointment Type]
    ExtractFeatures --> AgeGroup[Age Group]
    ExtractFeatures --> SpecialNeeds[Special Needs]
    ExtractFeatures --> WaitTime[Current Wait Time]
    ExtractFeatures --> ProcedureTime[Estimated Procedure Time]
    
    %% Facility State Factors
    FetchFacility --> ResourceAvailability[Resource Availability]
    FetchFacility --> DepartmentLoads[Department Loads]
    FetchFacility --> PeakHours[Peak Hours Status]
    FetchFacility --> PatientCount[Current Patient Count]
    
    %% ML Model Integration
    CalculatePriority --> MLModel[ML Model]
    PredictWaitTimes --> MLModel
    MLModel --> TrainedWeights[Trained Weights]
```

## Component Hierarchy

```mermaid
flowchart TD
    %% Main Layout
    App[_app.tsx] --> ThemeProvider[ThemeProvider]
    ThemeProvider --> PageComponent[Page Component]
    
    %% Dashboard Page Structure
    PageComponent --> DashboardPage[dashboard.tsx]
    DashboardPage --> Navbar[Navbar]
    DashboardPage --> TabsComponent[Tabs Component]
    DashboardPage --> Footer[Footer]
    
    %% Dashboard Tabs
    TabsComponent --> QueueTab[Queue Tab]
    TabsComponent --> VisualizationTab[Visualization Tab]
    TabsComponent --> PatientsTab[Patients Tab]
    TabsComponent --> FacilityTab[Facility Tab]
    TabsComponent --> SettingsTab[Settings Tab]
    
    %% Queue Tab Components
    QueueTab --> QueueDashboard[QueueDashboard]
    QueueDashboard --> PatientList[Patient List]
    QueueDashboard --> StatusControls[Status Controls]
    QueueDashboard --> RefreshButton[Refresh Button]
    
    %% Visualization Tab
    VisualizationTab --> QueueVisualization[QueueVisualization]
    QueueVisualization --> WaitTimeChart[Wait Time Chart]
    QueueVisualization --> DepartmentDistribution[Department Distribution]
    QueueVisualization --> ResourceUtilization[Resource Utilization]
    
    %% Patients Tab
    PatientsTab --> AddPatientForm[AddPatientForm]
    PatientsTab --> PatientSearch[Patient Search]
    PatientsTab --> PatientFilters[Patient Filters]
    
    %% Facility Tab
    FacilityTab --> ResourceSettings[Resource Settings]
    FacilityTab --> DepartmentSettings[Department Settings]
    FacilityTab --> ProcessingTimeSettings[Processing Time Settings]
```

## Patient Status Flow

```mermaid
stateDiagram-v2
    [*] --> Waiting: Patient Added
    Waiting --> InProgress: Doctor Starts Treatment
    InProgress --> Completed: Treatment Finished
    InProgress --> Cancelled: Treatment Cancelled
    Waiting --> Cancelled: Patient Leaves
    Completed --> [*]
    Cancelled --> [*]
```

## Technology Stack

```mermaid
flowchart TD
    %% Frontend
    Frontend[Frontend] --> NextJS[Next.js]
    Frontend --> React[React]
    Frontend --> TypeScript[TypeScript]
    Frontend --> TailwindCSS[Tailwind CSS]
    Frontend --> FramerMotion[Framer Motion]
    Frontend --> HeadlessUI[Headless UI]
    
    %% Backend
    Backend[Backend] --> NodeJS[Node.js]
    Backend --> Express[Express]
    Backend --> TensorflowJS[TensorFlow.js]
    
    %% Database
    Database[Database] --> Firebase[Firebase]
    Firebase --> Firestore[Firestore]
    Firebase --> Authentication[Authentication]
    
    %% DevOps
    DevOps[DevOps] --> Git[Git]
    DevOps --> NPM[NPM]
```

This flowchart provides a comprehensive overview of the flowAID healthcare queue optimization system, showing the relationships between different components, data flow, and the overall architecture of the application.
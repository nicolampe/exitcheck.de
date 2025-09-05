# Architecture Documentation

## Overview

The application is a web-based exit calculator for businesses called "exitcheck.de". It allows business owners to assess the value of their company and its readiness for exit/sale. Users fill out a questionnaire about their business, and the system calculates an exit readiness score and a valuation range based on their inputs.

The application follows a modern fullstack JavaScript architecture with:
- Frontend: React-based single-page application with TailwindCSS and shadcn UI components
- Backend: Express.js Node.js server
- Database: PostgreSQL with Drizzle ORM
- Deployment: Configured for Replit with support for scaling

## System Architecture

The system follows a client-server architecture with a clear separation between frontend and backend:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Client   │──────│  Express Server │──────│  PostgreSQL DB  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Directory Structure

```
├── client/               # Frontend React application
│   ├── src/              # React source code
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and types
│   │   └── pages/        # Page components
├── server/               # Backend Express.js server
│   ├── data/             # Static data files
│   ├── utils/            # Server utilities
│   └── index.ts          # Main server entry point
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and type definitions
└── migrations/           # Database migrations
```

## Key Components

### Frontend

1. **React SPA**
   - Implemented with React and TypeScript
   - Uses Wouter for routing (lightweight alternative to React Router)
   - TailwindCSS for styling with a custom theme defined in `tailwind.config.ts`
   - shadcn UI component library for consistent UI elements

2. **Key Pages**
   - Home: Landing page with benefits, testimonials, and FAQ
   - QuestionnaireForm: Main exit calculator questionnaire
   - ThankYouPage: Results page showing valuation and exit readiness
   - Legal pages (Impressum, Datenschutz)

3. **Data Fetching**
   - TanStack React Query for data fetching and cache management
   - Custom `apiRequest` utility function for consistent API calls

### Backend

1. **Express Server**
   - Node.js with Express framework
   - TypeScript for type safety
   - API routes for questionnaire processing
   - Static file serving for the React app

2. **Score Calculation**
   - `scoreCalculator.ts` calculates the exit readiness score
   - Uses industry-specific multipliers from `questions.json` data

3. **Database Connection**
   - Connects to PostgreSQL using Neon Serverless
   - Uses WebSockets for connection pooling

### Database

1. **Schema**
   - Two main tables:
     - `exit_calculator_results`: Stores calculation results
     - `leads`: Stores user contact information
   - Uses Drizzle ORM for type-safe database operations
   - Zod for schema validation

2. **Storage Interface**
   - Abstracted storage layer with in-memory fallback

## Data Flow

The main data flow through the application is:

1. User fills out questionnaire on the frontend
2. Form data is validated client-side
3. Data is sent to the server via API call
4. Server processes form data using score calculator
5. Results are stored in the database
6. Valuation and exit readiness results are returned to client
7. Results are displayed to the user on the thank you page
8. User data is stored as a lead for follow-up

## External Dependencies

### Frontend Dependencies
- React and React DOM
- TailwindCSS for styling
- shadcn UI (based on Radix UI) for accessible components
- TanStack React Query for data fetching
- Wouter for routing
- Lucide React for icons
- date-fns for date manipulation

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database access
- Neon Serverless for PostgreSQL connection
- Zod for schema validation

### Third-Party Integrations
- Meta Pixel for analytics (integration in `index.html`)
- Anthropic Claude AI SDK (likely for lead qualification or analysis)

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Environment**
   - `npm run dev` runs both server and client in development mode
   - Vite dev server for frontend
   - TypeScript with tsx for backend

2. **Build Process**
   - Client: Vite builds static assets to `dist/public`
   - Server: esbuild bundles server code to `dist/index.js`

3. **Production Environment**
   - Configured for auto-scaling on Replit
   - Express serves static files from build output
   - Database connection provided via environment variables

4. **Infrastructure Requirements**
   - Node.js runtime environment
   - PostgreSQL database (Neon Serverless)
   - Environment variables:
     - `DATABASE_URL`: PostgreSQL connection string

## Security Considerations

1. **Data Validation**
   - All input data is validated using Zod schemas
   - Structured error handling with HTTP status codes

2. **Frontend Security**
   - Form validation to prevent invalid data
   - API request abstractions with proper error handling

3. **Personal Data Handling**
   - Collects user contact information (name, email, phone)
   - GDPR compliance information in Datenschutz page
# exitcheck.de Replit Configuration

## Overview

exitcheck.de is a German business valuation and exit readiness assessment platform. The application helps business owners calculate the market value of their companies and assess their readiness for a potential exit/sale. Users complete questionnaires about their business model, financials, and operational structure to receive personalized valuation estimates and actionable insights for improving their exit potential.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA** with TypeScript built using Vite
- **Component Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS with custom design system using Inter font
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React state with TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: RESTful endpoints with JSON responses
- **File Structure**: Organized into `/server` with routes, storage layer, and utilities
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **ORM**: Drizzle with type-safe schemas
- **Tables**: 
  - `exit_calculator_results` - Standard exit calculator results
  - `experto_calculator_results` - Expert valuation method results  
  - `leads` - User contact information and lead management
- **Schema Location**: Shared between client/server in `/shared/schema.ts`

### Application Features
- **Dual Calculator Systems**:
  - Standard questionnaire-based exit readiness assessment
  - Expert calculator using Everto multiplier valuation method
- **PDF Generation**: Client-side PDF reports using jsPDF
- **Chat Interface**: Conversational questionnaire flow
- **Lead Capture**: Contact form integration with lead scoring
- **Responsive Design**: Mobile-first approach with desktop enhancements

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types and schemas
├── migrations/      # Database migrations
└── attached_assets/ # Business logic documentation
```

## External Dependencies

### Core Runtime
- **Database**: PostgreSQL via Neon serverless (@neondatabase/serverless)
- **WebSocket**: ws library for real-time connections

### AI Integration
- **Anthropic SDK**: @anthropic-ai/sdk for AI-powered analysis

### Analytics & Tracking
- **Meta Pixel**: Facebook tracking pixel for conversion analytics
- **Replit Integration**: Development environment specific tooling

### UI Libraries
- **Radix UI**: Complete set of accessible component primitives
- **TailwindCSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

### Form & Validation
- **React Hook Form**: Form state management with @hookform/resolvers
- **Zod**: Runtime type validation and schema validation

### Development Tools
- **Vite**: Build tool with React plugin and runtime error overlay
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Fast bundling for production builds
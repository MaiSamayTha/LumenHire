# Lumenhire Talent Platform

Lumenhire is a re-imagined hiring workspace that unifies candidate journeys, recruiter rituals, and analytics under a single experience. The project pairs a refined Next.js front end with a Spring Boot backend restructured around domain-driven modules.

## Highlights
- Modern landing experience with motion design, glassmorphism, and role-driven storytelling.
- Auth, job search, and recruiter dashboards refreshed with consistent night-mode styling.
- Backend reorganised into `api`, `application`, `domain`, and `infrastructure` layers with constructor-driven services.
- Explicit domain models (no Lombok magic) and annotation-processor safe build configuration.
- JWT onboarding endpoints, job pipeline management, and meeting automation retained with clearer logging.

## Local Setup

### Prerequisites
- Java 17+
- Node.js 18+
- npm 9+
- MySQL (or update `application.properties` to point to your database)

### Backend
```bash
cd backend/restservices
./mvnw.cmd -DskipTests spring-boot:run
```

### Frontend
```bash
cd frontend/my-app
npm install
npm run dev
```

The frontend expects the API to be available at the host configured inside `frontend/my-app/data/common.tsx`.

## Structure Overview
```
backend/restservices
 +- src/main/java/com/lumenhire/platform
     +- api/…          # REST controllers & DTOs
     +- application/… # service layer and orchestration
     +- domain/…      # entities and value objects
     +- infrastructure/… # persistence, config, notifications
frontend/my-app
 +- app/              # Next.js routes
 +- components/       # UI primitives and sections
 +- data/             # API clients
```

## Quick Commands
```bash
# Frontend linting
cd frontend/my-app
npm run lint

# Backend compilation check
cd backend/restservices
./mvnw.cmd -DskipTests compile
```

## Notes
- The original Zoom scheduling logic now logs via SLF4J `LoggerFactory` instead of Lombok annotations.
- ATS scoring and meeting workflows remain intact but are organised behind the new service layer.
- Styling tokens live in `frontend/my-app/app/globals.css`; adjust gradients and radii there.
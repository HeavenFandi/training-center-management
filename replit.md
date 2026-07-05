# Training Center Management System

A React + TypeScript + Vite frontend for managing training centers — institutes, teachers, students, courses, sessions, classrooms, and categories.

## Stack

- React 19, TypeScript, Vite
- Redux Toolkit (state management)
- Material UI (MUI) — component library
- React Router DOM — routing
- Axios — HTTP client
- React Hook Form + Yup — forms and validation

## Running the project

```bash
npm run dev
```

The dev server starts on port 5000. The workflow **Start application** handles this automatically.

## Backend

The frontend proxies all `/api` requests to the hosted Azure backend:

```
https://training-center-api-evd9fjc5dkh8ayaw.germanywestcentral-01.azurewebsites.net
```

No local backend is needed. Proxy is configured in `vite.config.ts`.

## Project structure

```
src/
├── api/          # Axios API calls per domain (courses, classrooms, lectures, …)
├── assets/       # Static assets
├── components/   # Shared UI components
├── hooks/        # Custom React hooks
├── layouts/      # Page layout wrappers
├── pages/        # Route-level pages (admin, teacher, student)
├── routes/       # React Router config
├── store/        # Redux slices and store setup
├── types/        # Shared TypeScript types
├── utils/        # Utility functions
└── validation/   # Yup validation schemas
```

## User preferences

_No preferences recorded yet._

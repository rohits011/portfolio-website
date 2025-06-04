# Professional Portfolio Website

A modern, responsive portfolio website with an admin panel for content management, built with React and Express.js.

## Features

- **Professional Portfolio Display**
  - Hero section with profile information
  - About section with personal details
  - Projects showcase with filtering
  - Skills visualization with proficiency levels
  - Work experience timeline
  - Contact form with message handling

- **Admin Panel**
  - Secure login system
  - Content management dashboard
  - Project management (add, edit, delete)
  - Skills management with categories
  - Experience management
  - Profile information editing
  - Contact messages viewing

- **Technical Features**
  - Dark theme with smooth animations
  - Fully responsive design
  - In-memory data storage
  - Session-based authentication
  - Form validation with Zod
  - Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Build Tool**: Vite
- **Authentication**: Session-based with express-session

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5000`

## Admin Access

To access the admin panel:
1. Navigate to `/admin`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── vite.ts          # Vite integration
├── shared/              # Shared types and schemas
└── components.json      # shadcn/ui configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

The application can be deployed on any platform that supports Node.js:
- Replit (current platform)
- Vercel
- Netlify
- Railway
- Heroku

## License

This project is open source and available under the MIT License.
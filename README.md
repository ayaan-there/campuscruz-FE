# 🚗 CampusCruz Frontend

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.12-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-16.0.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](http://makeapullrequest.com)
[![Code Style](https://img.shields.io/badge/Code%20Style-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)
[![Axios](https://img.shields.io/badge/HTTP%20Client-Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![React Router](https://img.shields.io/badge/React%20Router-6.22.3-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Formik](https://img.shields.io/badge/Forms-Formik-172B4D?style=for-the-badge)](https://formik.org/)

*A modern, responsive web application for campus ride-sharing built with React and Material-UI*

[🚀 Live Demo](https://campuscruz.vercel.app) • [📖 API Documentation](#api-integration) • [🐛 Report Bug](https://github.com/your-repo/issues) • [✨ Request Feature](https://github.com/your-repo/issues)

</div>

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🎨 UI Components](#-ui-components)
- [🔐 Authentication](#-authentication)
- [🗺 Maps Integration](#-maps-integration)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Development](#-development)
- [📚 API Integration](#-api-integration)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## 🎯 Overview

CampusCruz Frontend is a cutting-edge React application that facilitates campus ride-sharing for students and faculty. Built with modern web technologies, it provides an intuitive and seamless experience for finding, offering, and managing rides within campus communities.

### 🌟 Key Highlights

- **Modern React Architecture**: Built with React 18 and functional components with hooks
- **Material Design**: Clean, professional UI using Material-UI components
- **Real-time Updates**: Dynamic ride status tracking and notifications
- **Mobile-First**: Fully responsive design optimized for all devices
- **Google Maps Integration**: Interactive maps for route planning and visualization
- **Secure Authentication**: JWT-based authentication with protected routes
- **Admin Dashboard**: Comprehensive admin panel for platform management

## ✨ Features

### 🔍 Core Functionality
- **Ride Discovery**: Browse and search for available rides
- **Ride Offering**: Create and manage ride offers
- **Real-time Booking**: Instant ride booking with status updates
- **User Profiles**: Comprehensive user profile management
- **Ride History**: Track past and upcoming rides
- **Reviews & Ratings**: Rate and review ride experiences

### 👨‍💼 Admin Features
- **Dashboard Analytics**: Comprehensive platform statistics
- **User Management**: Monitor and manage user accounts
- **Ride Monitoring**: Oversee all ride activities
- **Content Moderation**: Manage reviews and reports

### 🛡 Security & Performance
- **Protected Routes**: Role-based access control
- **Form Validation**: Robust client-side validation using Formik + Yup
- **Error Handling**: Comprehensive error boundary and handling
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Smooth loading indicators and skeletons

## 🛠 Tech Stack

### **Frontend Framework**
- **React 18.2.0** - Modern React with hooks and functional components
- **Vite 5.1.6** - Next-generation frontend tooling for fast builds

### **UI & Styling**
- **Material-UI 5.15.12** - Comprehensive React component library
- **Emotion** - CSS-in-JS styling solution
- **CSS3** - Custom styling for enhanced user experience

### **State Management & Routing**
- **React Router DOM 6.22.3** - Declarative routing for React
- **React Context API** - Global state management for authentication

### **Form Handling & Validation**
- **Formik 2.4.5** - Build forms without tears
- **Yup 1.3.3** - Schema validation library

### **Maps & Location**
- **Google Maps API** - Interactive maps and location services
- **@react-google-maps/api 2.20.6** - React wrapper for Google Maps

### **HTTP Client & Utils**
- **Axios 1.6.7** - Promise-based HTTP client
- **date-fns 2.30.0** - Modern date utility library
- **React Toastify 10.0.4** - Beautiful toast notifications
- **cookie-parser 1.4.7** - Cookie parsing middleware

### **Development Tools**
- **ESLint 8.57.0** - Code linting and formatting
- **Vite Dev Server** - Fast development server with HMR
- **@mui/x-date-pickers 6.19.6** - Advanced date picker components

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/campuscruz-FE.git
   cd campuscruz-FE/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   VITE_API_URL=https://campuscruz.onrender.com
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Getting Started

### Development Server

```bash
# Start development server with hot reload
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the application for production
npm run build

# Preview the production build
npm run preview
```

### Code Quality

```bash
# Run ESLint to check for code issues
npm run lint

# Auto-fix ESLint issues
npm run lint:fix
```

## 📁 Project Structure

```
frontend/
├── 📄 index.html              # HTML template
├── 📄 package.json            # Project dependencies and scripts
├── 📄 vercel.json             # Vercel deployment configuration
├── 📄 eslint.config.js        # ESLint configuration
├── 📁 public/                 # Static assets
│   └── vite.svg
├── 📁 src/                    # Source code
│   ├── 📄 App.jsx             # Main application component
│   ├── 📄 main.jsx            # Application entry point
│   ├── 📄 config.jsx          # Application configuration
│   ├── 📄 routes.jsx          # Route definitions
│   ├── 📄 App.css             # Global styles
│   ├── 📄 index.css           # Root styles
│   │
│   ├── 📁 api/                # API service layer
│   │   ├──📄 auth.jsx           # Authentication API calls
│   │   └──📄 rides.js           # Ride-related API calls
│   │
│   ├── 📁 components/         # Reusable UI components
│   │   ├──📄 AdminRoute.jsx     # Admin route protection
│   │   ├──📄 PrivateRoute.jsx   # Authentication route protection
│   │   ├──📄 Navbar.jsx         # Navigation component
│   │   ├──📄 RideCard.jsx       # Ride display component
│   │   └──📄 Debug.jsx          # Development debugging component
│   │
│   ├── 📁 context/            # React Context providers
│   │   └──📄 AuthContext.jsx    # Authentication state management
│   │
│   ├── 📁 layouts/            # Page layout components
│   │   ├──📄 MainLayout.jsx     # Main application layout
│   │   └──📄 AuthLayout.jsx     # Authentication pages layout
│   │
│   ├── 📁 pages/              # Page components
│   │   ├──📄 Home.jsx           # Landing page
│   │   ├──📄 Login.jsx          # User login
│   │   ├──📄 Register.jsx       # User registration
│   │   ├──📄 Dashboard.jsx      # User dashboard
│   │   ├──📄 FindRide.jsx       # Ride search and discovery
│   │   ├──📄 OfferRide.jsx      # Ride creation
│   │   ├──📄 RideDetails.jsx    # Individual ride details
│   │   ├──📄 Profile.jsx        # User profile management
│   │   ├──📄 ForgotPassword.jsx # Password recovery
│   │   ├──📄 ResetPassword.jsx  # Password reset
│   │   ├──📄 NotFound.jsx       # 404 error page
│   │   └──📁 admin/             # Admin-specific pages
│   │       └──📄 AdminDashboard.jsx
│   │
│   ├── 📁 styles/             # Component-specific styles
│   │   └──📄 maps-autocomplete.css
│   │
│   ├── 📁 utils/              # Utility functions
│   │   ├──📄 api.js             # API configuration
│   │   ├──📄 apiClient.js       # HTTP client setup
│   │   ├──📄 errorHandler.jsx   # Error handling utilities
│   │   ├──📄 googleMapsLoader.jsx # Google Maps integration
│   │   └──📄 notificationService.js # Toast notification service
│   │
│   └── 📁 assets/             # Static assets
│       └──📄 react.svg
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=https://campuscruz.onrender.com

# Google Maps Integration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Optional: Development settings
VITE_DEBUG_MODE=false
```

### API Configuration

The application connects to the backend API through the configuration in `src/config.jsx`:

```javascript
// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://campuscruz.onrender.com';

// Ride Status Constants
export const RIDE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};
```

## 🎨 UI Components

### Material-UI Theme

The application uses a custom Material-UI theme with:
- **Primary Color**: Modern blue palette
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Breakpoints**: Mobile-first responsive design

### Key Components

#### RideCard Component
Displays ride information with:
- Departure and arrival locations
- Date and time
- Available seats
- Driver information
- Booking actions

#### Navbar Component
Responsive navigation with:
- Logo and branding
- User authentication status
- Mobile hamburger menu
- Search functionality

## 🔐 Authentication

### Auth Context

The application uses React Context for authentication state management:

```javascript
// AuthContext provides:
- user: Current user object
- login: Authentication function
- logout: Sign out function
- isAuthenticated: Boolean authentication status
- loading: Loading state for auth operations
```

### Protected Routes

- **PrivateRoute**: Requires user authentication
- **AdminRoute**: Requires admin privileges
- **Redirect Logic**: Automatic redirection based on auth status

### JWT Token Management

- Automatic token storage in localStorage
- Token validation on app initialization
- Automatic logout on token expiration

## 🗺 Maps Integration

### Google Maps Features

- **Interactive Maps**: Full Google Maps integration
- **Autocomplete**: Location search with suggestions
- **Route Visualization**: Display ride routes
- **Markers**: Pickup and dropoff points
- **Geolocation**: Current location detection

### Usage Example

```javascript
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

// Map component with route display
<GoogleMap
  center={center}
  zoom={zoom}
  mapContainerStyle={mapContainerStyle}
>
  <Marker position={pickupLocation} />
  <Marker position={dropoffLocation} />
  {directions && <DirectionsRenderer directions={directions} />}
</GoogleMap>
```

## 📱 Responsive Design

### Breakpoint Strategy

- **Mobile**: 0-599px (xs)
- **Tablet**: 600-959px (sm)
- **Desktop**: 960-1279px (md)
- **Large Desktop**: 1280px+ (lg, xl)

### Mobile-First Approach

- Touch-friendly interface
- Optimized navigation for mobile
- Responsive card layouts
- Adaptive typography scaling

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically

# Dependencies
npm install          # Install all dependencies
npm update           # Update dependencies
```

### Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Naming Conventions**: PascalCase for components, camelCase for functions
3. **File Organization**: Group related files in appropriate directories
4. **State Management**: Use React hooks and Context API
5. **Error Handling**: Implement comprehensive error boundaries
6. **Performance**: Use React.memo and useMemo for optimization

### Code Style

The project follows ESLint configuration with:
- React best practices
- Hook rules enforcement
- Unused variable detection
- Import/export organization

## 📚 API Integration

### Base API Configuration

```javascript
// API Client setup
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication API

```javascript
// Login
POST /api/auth/login
Body: { email, password }

// Register
POST /api/auth/register
Body: { name, email, password, phone, role }

// Profile
GET /api/auth/profile
Headers: { Authorization: Bearer <token> }
```

### Rides API

```javascript
// Get rides
GET /api/rides
Query: { from, to, date, seats }

// Create ride
POST /api/rides
Body: { from, to, date, time, seats, price }

// Book ride
POST /api/rides/:id/book
Headers: { Authorization: Bearer <token> }
```

## 🚀 Deployment

### Vercel Deployment

The application is configured for seamless Vercel deployment:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set up environment variables in Vercel dashboard
3. **Domain Configuration**: Configure custom domain if needed
4. **Automatic Deployments**: Push to main branch triggers deployment

### Build Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Image and CSS optimization
- **Gzip Compression**: Automatic compression for smaller bundle sizes
- **Caching**: Optimal caching headers for static assets

## 🤝 Contributing

We welcome contributions to CampusCruz Frontend! Please follow these guidelines:

### Development Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request


### Pull Request Process

1. Ensure your code passes all linting checks
2. Update the README.md with details of changes if applicable
3. Add screenshots for UI changes
4. Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Material-UI** for the beautiful component library
- **Vite** for the lightning-fast build tool
- **Google Maps** for the mapping services
- **Vercel** for the deployment platform

---

<div align="center">

**Built with ❤️ for the campus community**

[⬆ Back to Top](#-campuscruz-frontend)

</div>

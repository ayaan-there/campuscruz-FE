import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import the maps CSS file to apply styling to Google Maps components
import './styles/maps-autocomplete.css';

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.toString()}</p>
          <div>
            <button onClick={() => window.location.href = '/test'}>
              Try Test Component
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Create root with more detailed error handling
const root = document.getElementById('root');
console.log('Root element found:', !!root);

// Check if we're on the test route
const isTestRoute = window.location.pathname === '/test';

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        {isTestRoute ? <TestComponent /> : <App />}
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('React render initiated');
} catch (error) {
  console.error('Failed to render React application:', error);
  // Display error directly in DOM as a fallback
 if (root) {
  root.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1>Application Error</h1>
      <p>Sorry, the application couldn't load correctly. Please try refreshing the page.</p>
      ${import.meta.env.DEV ? `<p>Error: ${error.message}</p>` : ''}
    </div>
  `;
  
  // Only log detailed errors in development
  if (import.meta.env.DEV) {
    console.error('Failed to render React application:', error);
  }
}
}

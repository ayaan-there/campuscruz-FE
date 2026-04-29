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
          <button onClick={() => window.location.href = '/'}>
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render React application:', error);
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h1>Application Error</h1>
        <p>Sorry, the application couldn't load correctly. Please try refreshing the page.</p>
        ${import.meta.env.DEV ? `<p>Error: ${error.message}</p>` : ''}
      </div>
    `;
    
    if (import.meta.env.DEV) {
      console.error('Failed to render React application:', error);
    }
  }
}

// Create this file: c:\Users\ASUS\Desktop\ALL-PROJECTS\Campuscruz\frontend\src\utils\googleMapsLoader.js

// Replace the existing Google Maps loader with:
let googleMapsPromise = null;
let callbackQueue = [];

export const loadGoogleMapsApi = () => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      // Load maps script dynamically with restricted API key
      const script = document.createElement('script');
      
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      if (!apiKey) {
        console.warn('Google Maps API key not found in environment variables');
        // Continue with empty key, which will work for development but show watermarks
      }
      
      // Set URL with referrer and IP restrictions enabled in Google Cloud Console
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define callback
      window.initMap = () => {
        console.log('Google Maps API loaded successfully');
        resolve(window.google);
        
        // Execute any registered callbacks
        while (callbackQueue.length > 0) {
          const callback = callbackQueue.shift();
          try {
            callback(window.google);
          } catch (err) {
            console.error('Error in Google Maps callback:', err);
          }
        }
      };
      
      // Handle errors
      script.onerror = () => {
        const error = new Error('Failed to load Google Maps API');
        console.error(error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }
  
  return googleMapsPromise;
};

// Add the missing function
export const registerMapCallback = (callback) => {
  if (window.google && window.google.maps) {
    // API already loaded, execute callback immediately
    try {
      callback(window.google);
    } catch (err) {
      console.error('Error executing Google Maps callback:', err);
    }
  } else {
    // Queue callback for execution when API loads
    callbackQueue.push(callback);
    
    // Make sure the API loading is initiated
    loadGoogleMapsApi().catch(err => {
      console.error('Error loading Google Maps API:', err);
    });
  }
};
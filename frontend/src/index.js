import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ import for rendering
import './index.css'; // Global CSS
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Correct path to AuthContext

// Get the root element
const rootElement = document.getElementById('root');

// Create the root React DOM element
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

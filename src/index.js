import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from '../src/service/auth/AuthContext';

// Check for existing tab
const tabKey = 'myAppSingleTabKey';

if (localStorage.getItem(tabKey)) {
  // Another tab is open
  alert('This application is already open in another tab. Please use that tab.');
  window.location.href = 'about:blank'; // Redirect to blank page
} else {
  // Set the flag
  localStorage.setItem(tabKey, 'locked');

  // Clear the flag when tab is closed
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem(tabKey);
  });

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

reportWebVitals();
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; 
import App from './App'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { setAuthToken } from './authAxios';

// Check in localStorage
const token = localStorage.getItem('accessToken');
if (token) {
    setAuthToken(token);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
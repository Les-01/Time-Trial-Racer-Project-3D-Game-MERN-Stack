import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthorisationContextProvider} from './context/authorisationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthorisationContextProvider>
      <App />
    </AuthorisationContextProvider>
  </React.StrictMode>
);
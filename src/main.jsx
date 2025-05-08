import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { registerSW } from 'virtual:pwa-register';

// prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('ZigZag has been updated! Reload?')) {
      updateSW(true);
    }
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

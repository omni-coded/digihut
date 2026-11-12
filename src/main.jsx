import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { UIProvider } from './ui/UIContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </LanguageProvider>
  </StrictMode>,
);

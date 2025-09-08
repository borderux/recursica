import './styles.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeConsoleOverride } from './utils/consoleOverride';

// Initialize console.log override to send logs to GTM
initializeConsoleOverride();

createRoot(document.getElementById('root')!).render(<App />);

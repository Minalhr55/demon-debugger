import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Ensure there is a <div id='root'></div> in your index.html. " +
    "This is required for the React application to mount."
  );
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error(
    "Critical Error during Application Initialization: ",
    error instanceof Error ? error.message : String(error),
    "\nStack Trace: ",
    error instanceof Error ? error.stack : "No stack trace available"
  );
}
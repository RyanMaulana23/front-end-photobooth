import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AllRoutes from './routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <AllRoutes />
  </StrictMode>,
);

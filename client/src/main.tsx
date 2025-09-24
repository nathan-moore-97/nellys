import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import 'bootswatch/dist/pulse/bootstrap.min.css';
import './theme/nellys-needlers.css';

createRoot(document.getElementById('root')!).render(
  <App />
)

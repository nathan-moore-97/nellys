import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import 'bootswatch/dist/pulse/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <App />
)

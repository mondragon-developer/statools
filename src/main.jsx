import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const Audit = import.meta.env.DEV && new URLSearchParams(location.search).has('audit')
  ? React.lazy(() => import('./AccessibilityAudit.jsx')) : null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {Audit && <React.Suspense fallback={null}><Audit /></React.Suspense>}
  </React.StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import TrailContextProvider from './context/TrailContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/HIKEAZY-/admin-demo">
    <AdminContextProvider>
      <TrailContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </TrailContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)

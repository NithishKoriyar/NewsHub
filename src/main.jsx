import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ArticlesProvider from './context/ArticlesContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ArticlesProvider>
      <App />
    </ArticlesProvider>
  // </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiProvider } from './context/ApiContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DocumentProvider } from './context/DocumentContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <ApiProvider>
    <AuthProvider>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </AuthProvider>
  </ApiProvider>
</BrowserRouter>
)

import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/app/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/app/UploadPage'
import DocumentPage from './pages/app/DocumentPage'
import AppLayout from './layouts/AppLayout'
import DocumentsPage from './pages/app/DocumentsPage'

function App() {
  return (
    <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route path="/home" element={<HomePage />} />
    <Route path="/upload" element={<UploadPage />} />
    <Route path="/documents/:id" element={<DocumentPage />} />
    <Route path="/documents" element={<DocumentsPage />} /> 
  </Route>
</Routes>
  )
}

export default App

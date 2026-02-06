import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExpertIntake from './pages/ExpertIntake'
import Admin from './pages/Admin'
import AdminDocumentDetail from './pages/AdminDocumentDetail'
import Submissions from './pages/Submissions'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expert-intake" element={<ExpertIntake />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/document/:id" element={<AdminDocumentDetail />} />
        <Route path="/submissions" element={<Submissions />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

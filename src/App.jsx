import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExpertIntake from './pages/ExpertIntake'
import Submissions from './pages/Submissions'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expert-intake" element={<ExpertIntake />} />
        <Route path="/submissions" element={<Submissions />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

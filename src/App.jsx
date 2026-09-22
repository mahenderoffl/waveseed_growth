import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import AdminLogin from './admin/AdminLogin'
import LeadsPage from './admin/LeadsPage'
import TestimonialsPage from './admin/TestimonialsPage'
import CaseStudiesPage from './admin/CaseStudiesPage'
import SettingsPage from './admin/SettingsPage'
import RequireAdmin from './admin/RequireAdmin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin><LeadsPage /></RequireAdmin>} />
      <Route path="/admin/testimonials" element={<RequireAdmin><TestimonialsPage /></RequireAdmin>} />
      <Route path="/admin/case-studies" element={<RequireAdmin><CaseStudiesPage /></RequireAdmin>} />
      <Route path="/admin/settings" element={<RequireAdmin><SettingsPage /></RequireAdmin>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

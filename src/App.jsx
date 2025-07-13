import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Login from './pages/Login'
import MembershipsList from './pages/MembershipsList'
import RegisterUser from './pages/RegisterUser'
import UserDetails from './pages/UserDetails'
import ManagersList from './pages/ManagersList'
import ManagerProfile from './pages/ManagerProfile'
import RegisterManager from './pages/RegisterManager'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/membresias" element={<MembershipsList />} />
            <Route path="/inscribir-usuario" element={<RegisterUser />} />
            <Route path="/detalles-usuario/:userId" element={<UserDetails />} />
            <Route path="/perfil-administrador/:managerId" element={<ManagerProfile />} />
            <Route path="/administradores" element={<ManagersList />} />
            <Route path="/agregar-administrador" element={<RegisterManager />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

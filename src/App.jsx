import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Login from './pages/Login'
import UserDetails from './pages/UserDetails'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/membresias" element={<Home />} />
            <Route path="/inscribir-usuario" element={<Registration />} />
            <Route path="/user-details/:userId" element={<UserDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

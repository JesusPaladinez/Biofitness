import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Nav from './components/Nav'
import Footer from './components/Footer'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

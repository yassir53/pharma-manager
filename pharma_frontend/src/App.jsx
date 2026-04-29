import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route, Navigate ,BrowserRouter} from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Medicaments from './pages/Medicaments';
import Vente from './pages/Vente';


function App() {
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicaments" element={<Medicaments />} />
        <Route path="/vente" element={<Vente />} />
      </Routes>
    </BrowserRouter>

  </>
  )
}

export default App

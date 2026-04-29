import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route, Navigate ,BrowserRouter} from 'react-router-dom';
import Login from './pages/login';


function App() {
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        </Routes>
    </BrowserRouter>

  </>
  )
}

export default App

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Builder from './pages/Builder';
import AppLayout from './AppLayout';
import PreviewFill from './pages/PreviewFill';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css'

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/forms" element={<Builder />} />
        <Route path="/" element={<Home />} />
        <Route path="/forms/:id" element={<PreviewFill />} />
       
      </Route>
    </Routes>
  )
}

export default App

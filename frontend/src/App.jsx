import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Lista from './pages/Lista';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/lista" element={<Lista />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2026 Banco de Ideas de Emprendimiento - Componente Práctico DW</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

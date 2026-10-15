import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page-container page-home">
      <section className="hero-banner">
        <span className="hero-tag">Plataforma de Innovación y Emprendimiento</span>
        <h1 className="hero-title">Banco de Ideas de Emprendimiento</h1>


        <div className="hero-actions">
          <Link to="/registro" className="btn btn-primary btn-lg">
            ✍️ Registrar Nueva Idea
          </Link>
          <Link to="/lista" className="btn btn-secondary btn-lg">
            🔍 Consultar Ideas Publicadas
          </Link>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Publicación de Proyectos</h3>
          <p>
            Registra tu iniciativa con datos completos del proponente, correo de contacto, 
            sector productivo y descripción detallada del problema que resuelve.
          </p>
          <Link to="/registro" className="feature-link">Ir al formulario &rarr;</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Consulta Centralizada</h3>
          <p>
            Explora todas las propuestas enviadas a través de nuestra API REST, 
            con almacenamiento persistente en archivos JSON sin pérdida de datos.
          </p>
          <Link to="/lista" className="feature-link">Ver catálogo &rarr;</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Validación Extremo a Extremo</h3>
          <p>
            Doble validación en cliente (React) y servidor (Express) garantizando 
            integridad en correos, fechas obligatorias y campos requeridos.
          </p>
          <span className="feature-badge">Arquitectura SPA + REST</span>
        </div>
      </section>
    </div>
  );
}

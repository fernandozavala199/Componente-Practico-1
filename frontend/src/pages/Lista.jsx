import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';
import AlertMessage from '../components/AlertMessage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');

export default function Lista() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filtroSector, setFiltroSector] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Consulta de registros con GET
  const cargarIdeas = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/registros`);
      if (!response.ok) {
        throw new Error(`Error en el servidor: HTTP ${response.status}`);
      }
      const data = await response.json();

      // Manejar formato flexible (array directo o { exito: true, datos: [...] })
      let lista = [];
      if (Array.isArray(data)) {
        lista = data;
      } else if (data && Array.isArray(data.datos)) {
        lista = data.datos;
      } else {
        lista = [];
      }

      setIdeas(lista);
    } catch (err) {
      console.error('Error al consultar ideas:', err);
      setErrorMsg(
        'No se pudo conectar con el servidor backend. Verifica que el servidor esté en ejecución.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIdeas();
  }, []);

  // Filtrado reactivo en cliente por sector y búsqueda de texto
  const ideasFiltradas = ideas.filter((item) => {
    const coincideSector = filtroSector === 'Todos' || item.sector === filtroSector;
    const termino = busqueda.toLowerCase().trim();
    const coincideTexto =
      !termino ||
      (item.titulo && item.titulo.toLowerCase().includes(termino)) ||
      (item.proponente && item.proponente.toLowerCase().includes(termino)) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(termino));

    return coincideSector && coincideTexto;
  });

  return (
    <div className="page-container page-lista">
      <div className="page-header header-with-action">
        <div>
          <span className="breadcrumb">
            <Link to="/">Inicio</Link> &gt; <span>Consultar Ideas</span>
          </span>
          <h2>Catálogo de Ideas de Emprendimiento</h2>
          <p className="page-subtitle">
            Explora las iniciativas registradas en el sistema a través de la API REST.
          </p>
        </div>
        <Link to="/registro" className="btn btn-primary">
          ✍️ Nueva Idea
        </Link>
      </div>

      {/* Alerta de error */}
      {errorMsg && (
        <div className="error-container">
          <AlertMessage type="error" message={errorMsg} />
          <button onClick={cargarIdeas} className="btn btn-secondary mt-2">
            🔄 Reintentar Conexión
          </button>
        </div>
      )}

      {/* Barra de filtros y búsqueda */}
      {!loading && !errorMsg && ideas.length > 0 && (
        <div className="filters-bar">
          <div className="filter-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por título, proponente o palabra clave..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <label htmlFor="filtro-sector">Sector:</label>
            <select
              id="filtro-sector"
              value={filtroSector}
              onChange={(e) => setFiltroSector(e.target.value)}
            >
              <option value="Todos">Todos los sectores ({ideas.length})</option>
              <option value="Tecnología">Tecnología y Software</option>
              <option value="Sostenibilidad">Sostenibilidad y Medio Ambiente</option>
              <option value="Salud">Salud y Biotecnología</option>
              <option value="Educación">Educación y Cultura</option>
              <option value="Gastronomía">Gastronomía y Agroindustria</option>
              <option value="Comercio">Comercio y FinTech</option>
            </select>
          </div>
        </div>
      )}

      {/* Estado: Cargando */}
      {loading && (
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p>Consultando registros desde la API en Express...</p>
        </div>
      )}

      {/* Estado: Lista vacía total (no hay registros en el archivo JSON) */}
      {!loading && !errorMsg && ideas.length === 0 && (
        <div className="state-box empty-box">
          <div className="empty-icon">💡</div>
          <h3>Aún no hay ideas registradas</h3>
          <p>Sé el primer emprendedor en registrar una idea en la plataforma.</p>
          <Link to="/registro" className="btn btn-primary btn-lg mt-3">
            Publicar la Primera Idea
          </Link>
        </div>
      )}

      {/* Estado: Sin resultados tras aplicar filtro */}
      {!loading && !errorMsg && ideas.length > 0 && ideasFiltradas.length === 0 && (
        <div className="state-box empty-box">
          <p>No se encontraron ideas que coincidan con los filtros aplicados.</p>
          <button
            onClick={() => {
              setFiltroSector('Todos');
              setBusqueda('');
            }}
            className="btn btn-secondary mt-2"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* Grid de tarjetas de ideas */}
      {!loading && !errorMsg && ideasFiltradas.length > 0 && (
        <>
          <div className="results-counter">
            Mostrando <strong>{ideasFiltradas.length}</strong> de <strong>{ideas.length}</strong> idea(s) registrada(s).
          </div>
          <div className="cards-grid">
            {ideasFiltradas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

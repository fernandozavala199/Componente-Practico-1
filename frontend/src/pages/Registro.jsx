import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');

export default function Registro() {
  const navigate = useNavigate();

  // Fecha actual en formato YYYY-MM-DD para inicializar
  const hoy = new Date().toISOString().split('T')[0];

  // Estado del formulario
  const [formData, setFormData] = useState({
    proponente: '',
    email: '',
    titulo: '',
    descripcion: '',
    fecha: hoy,
    sector: 'Tecnología',
    etapa: 'Idea inicial'
  });

  // Estados de interfaz y feedback
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Limpiar alertas al escribir
    if (errorList.length > 0) setErrorList([]);
  };

  // Validaciones en cliente
  const validarFormulario = () => {
    const errores = [];

    if (!formData.proponente.trim() || formData.proponente.trim().length < 2) {
      errores.push('El nombre del proponente es obligatorio y debe tener al menos 2 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errores.push('El correo electrónico es obligatorio y debe tener un formato válido (ej. usuario@dominio.com).');
    }

    if (!formData.titulo.trim() || formData.titulo.trim().length < 3) {
      errores.push('El título de la idea es obligatorio y debe tener al menos 3 caracteres.');
    }

    if (!formData.descripcion.trim() || formData.descripcion.trim().length < 10) {
      errores.push('La descripción es obligatoria y debe contener al menos 10 caracteres.');
    }

    if (!formData.fecha) {
      errores.push('La fecha de registro es obligatoria.');
    } else {
      const fechaObj = new Date(formData.fecha);
      if (isNaN(fechaObj.getTime())) {
        errores.push('La fecha seleccionada no es válida.');
      }
    }

    if (!formData.sector.trim()) {
      errores.push('Debes seleccionar un sector económico.');
    }

    return errores;
  };

  // Envío del formulario (POST /registros)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorList([]);

    const clientErrors = validarFormulario();
    if (clientErrors.length > 0) {
      setErrorList(clientErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/registros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores devueltos por el servidor (código 400 u otro)
        if (data.errores && Array.isArray(data.errores)) {
          setErrorList(data.errores);
        } else {
          setErrorList([data.mensaje || 'Error al procesar la solicitud en el servidor.']);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Registro exitoso (código 201)
      setSuccessMessage('¡Idea de emprendimiento registrada exitosamente en el servidor!');
      
      // Limpiar formulario
      setFormData({
        proponente: '',
        email: '',
        titulo: '',
        descripcion: '',
        fecha: hoy,
        sector: 'Tecnología',
        etapa: 'Idea inicial'
      });

      // Redirigir a la lista de ideas después de 1.8 segundos
      setTimeout(() => {
        navigate('/lista');
      }, 1800);

    } catch (err) {
      console.error('Error al conectar con la API:', err);
      setErrorList([
        'No se pudo conectar con el servidor backend. Asegúrate de que la API esté iniciada.'
      ]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-registro">
      <div className="page-header">
        <span className="breadcrumb">
          <Link to="/">Inicio</Link> &gt; <span>Registrar Idea</span>
        </span>
        <h2>Registrar Nueva Idea de Emprendimiento</h2>
        <p className="page-subtitle">
          Completa todos los campos obligatorios para publicar tu iniciativa en la plataforma.
        </p>
      </div>

      {errorList.length > 0 && (
        <AlertMessage 
          type="error" 
          message={errorList} 
          onClose={() => setErrorList([])} 
        />
      )}

      {successMessage && (
        <AlertMessage 
          type="success" 
          message={`${successMessage} Redirigiendo a la lista...`} 
        />
      )}

      <form onSubmit={handleSubmit} className="form-card" noValidate>
        <div className="form-group">
          <label htmlFor="proponente">
            Nombre del Proponente <span className="required">*</span>
          </label>
          <input
            id="proponente"
            type="text"
            name="proponente"
            value={formData.proponente}
            onChange={handleChange}
            placeholder="Ejemplo: Carlos Mendoza"
            disabled={loading}
            required
          />
          <small className="form-help">Nombre completo de quien lidera o propone la idea.</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Correo Electrónico de Contacto <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              disabled={loading}
              required
            />
            <small className="form-help">Formato estándar de correo para contacto.</small>
          </div>

          <div className="form-group">
            <label htmlFor="fecha">
              Fecha de Registro <span className="required">*</span>
            </label>
            <input
              id="fecha"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <small className="form-help">Fecha de creación o publicación.</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="titulo">
            Título o Nombre de la Idea <span className="required">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ejemplo: EcoPlast - Empaques biodegradables"
            disabled={loading}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sector">
              Sector Económico / Categoría <span className="required">*</span>
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="Tecnología">Tecnología y Software</option>
              <option value="Sostenibilidad">Sostenibilidad y Medio Ambiente</option>
              <option value="Salud">Salud y Biotecnología</option>
              <option value="Educación">Educación y Cultura (EdTech)</option>
              <option value="Gastronomía">Gastronomía y Agroindustria</option>
              <option value="Comercio">Comercio, FinTech y Servicios</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="etapa">
              Etapa del Proyecto
            </label>
            <select
              id="etapa"
              name="etapa"
              value={formData.etapa}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Idea inicial">Idea inicial / Conceptualización</option>
              <option value="Prototipo">Prototipo / MVP en desarrollo</option>
              <option value="En validación">En validación con clientes</option>
              <option value="En operación">En operación temprana</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción Detallada de la Idea <span className="required">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="5"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Explica el problema detectado, la solución propuesta y la propuesta de valor..."
            disabled={loading}
            required
          />
          <small className="form-help">Mínimo 10 caracteres. Sé lo más claro posible.</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '⏳ Guardando en el servidor...' : '🚀 Publicar Idea'}
          </button>
          <Link to="/lista" className="btn btn-secondary btn-lg">
            📋 Volver a la Lista
          </Link>
        </div>
      </form>
    </div>
  );
}

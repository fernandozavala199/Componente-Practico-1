import React from 'react';

/**
 * Componente reutilizable de tarjeta de registro de idea.
 */
export default function IdeaCard({ idea }) {
  const formatearFecha = (fechaStr) => {
    try {
      if (!fechaStr) return 'Sin fecha';
      const [year, month, day] = fechaStr.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return new Date(fechaStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  };

  const sectorBadgeColor = (sector) => {
    const map = {
      'Tecnología': 'badge-tech',
      'Sostenibilidad': 'badge-eco',
      'Salud': 'badge-health',
      'Educación': 'badge-edu',
      'Gastronomía': 'badge-food',
      'Comercio': 'badge-commerce'
    };
    return map[sector] || 'badge-default';
  };

  return (
    <article className="idea-card">
      <div className="card-top">
        <span className={`card-badge ${sectorBadgeColor(idea.sector)}`}>
          {idea.sector || 'General'}
        </span>
        <span className="card-date" title="Fecha registrada">
          📅 {formatearFecha(idea.fecha)}
        </span>
      </div>

      <h3 className="card-title">
        {idea.titulo || `Idea de ${idea.proponente}`}
      </h3>

      <div className="card-proponent-info">
        <p className="card-proponent">
          <strong>👤 Proponente:</strong> {idea.proponente}
        </p>
        <p className="card-email">
          <strong>✉️ Email:</strong> <a href={`mailto:${idea.email}`}>{idea.email}</a>
        </p>
      </div>

      <p className="card-description">
        {idea.descripcion}
      </p>

      {idea.etapa && (
        <div className="card-extra">
          <span className="card-etapa">🏷️ Etapa: {idea.etapa}</span>
        </div>
      )}

      <div className="card-footer">
        <small className="card-id" title="Identificador único">
          ID: {idea.id}
        </small>
      </div>
    </article>
  );
}

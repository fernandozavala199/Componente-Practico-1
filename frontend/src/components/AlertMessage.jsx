import React from 'react';

/**
 * Componente reutilizable para mensajes de alerta y confirmación.
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {string|Array<string>} message
 * @param {Function} [onClose]
 */
export default function AlertMessage({ type = 'info', message, onClose }) {
  if (!message) return null;

  const isArray = Array.isArray(message);

  return (
    <div className={`alert-box alert-${type}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '⚠️'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚡'}
        </span>
        <div className="alert-text">
          {isArray ? (
            <ul className="alert-list">
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>
      )}
    </div>
  );
}

import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import './ErrorBoundary.css';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1>Oops! {error.status}</h1>
          <p>{error.statusText}</p>
          {error.data?.message && (
            <p className="error-message">{error.data.message}</p>
          )}
          <div className="error-actions">
            <button onClick={() => navigate(-1)}>Voltar</button>
            <button onClick={() => navigate('/')}>Ir para Início</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Oops!</h1>
        <p>Desculpe, ocorreu um erro inesperado.</p>
        <div className="error-actions">
          <button onClick={() => navigate(-1)}>Voltar</button>
          <button onClick={() => navigate('/')}>Ir para Início</button>
        </div>
      </div>
    </div>
  );
} 
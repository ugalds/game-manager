import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header>
        <div className="logo">LOGO</div>
        <nav>
          <div className="nav-item active">Início</div>
          <div className="nav-item" onClick={() => navigate('/players')}>Gamers</div>
          <div className="nav-item" onClick={() => navigate('/saved-games')}>Salvos</div>
        </nav>
        <div className="icon-button" onClick={() => navigate('/folders')}>📋</div>
      </header>
      <div className="title">
        <div className="icon">👑</div>
        <div className="text">REI</div>
      </div>
      <div className="subtitle">DO BOZÓ</div>
      <button className="button" onClick={() => navigate('/create-game')}>
        <span className="icon">💾</span>
        MARCAR
      </button>
      <div className="dice-container">🎲</div>
    </div>
  );
};

export default Home; 
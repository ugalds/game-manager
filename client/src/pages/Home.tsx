import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="logo">
          <img src="/crown-logo.png" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <button className="nav-item active">Início</button>
          <button className="nav-item" onClick={() => navigate('/players')}>Gamers</button>
          <button className="nav-item" onClick={() => navigate('/saved-games')}>Salvos</button>
        </nav>
        <button className="chat-button">💻</button>
      </header>

      <main className="home-content">
        <div className="game-logo">
          <img src="/dice-cup.png" alt="Dados" className="dice-image" />
        </div>
        
        <div className="content-right">
          <div className="game-title">
            <img src="/crown-logo.png" alt="Coroa" className="crown-logo" />
            <h1>REI</h1>
            <h2>DO BOZÓ</h2>
          </div>

          <div className="action-buttons">
            <button className="start-game-button" onClick={() => navigate('/players')}>
              Marcar
            </button>
            <button className="rules-button" onClick={() => navigate('/saved-games')}>
              📋
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 
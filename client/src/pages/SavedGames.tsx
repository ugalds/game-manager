import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './SavedGames.css';

interface Player {
  id: number;
  name: string;
  avatar: string;
  points: number;
  categories?: { [key: string]: number };
}

interface Match {
  id: number;
  name: string;
  date: string;
  status: 'pending' | 'in_progress' | 'finished';
  players: Player[];
  currentPlayer?: number;
  round: number;
  winner?: number;
  startTime?: string;
}

const SavedGames: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameToDelete, setGameToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameToDelete !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.remove-confirmation') && !target.closest('.icon.delete')) {
          setGameToDelete(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [gameToDelete]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/matches');
      const data = response.data;
      
      const matchesWithPlayers = data.map((match: Match) => ({
        ...match,
        players: match.players.map(player => ({
          ...player,
          points: player.points || 0,
          categories: player.categories || {}
        }))
      }));
      
      setMatches(matchesWithPlayers);
    } catch (error: any) {
      console.error('Erro ao carregar jogos:', error);
      setError('Erro ao carregar jogos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/matches/${id}`);
      await loadMatches();
    } catch (error: any) {
      console.error('Erro ao deletar jogo:', error);
      setError('Erro ao deletar jogo. Por favor, tente novamente.');
    }
  };

  const handleOpenGame = async (match: Match) => {
    try {
      if (match.status === 'pending') {
        const updatedMatch = {
          ...match,
          status: 'in_progress',
          round: 1,
          currentPlayer: match.players[0]?.id,
          startTime: new Date().toISOString()
        };
        await api.put(`/matches/${match.id}`, updatedMatch);
      }
      navigate(`/marker/${match.id}`);
    } catch (error: any) {
      console.error('Erro ao abrir jogo:', error);
      setError('Erro ao abrir jogo. Por favor, tente novamente.');
    }
  };

  const calculatePlayTime = (startTime?: string) => {
    if (!startTime) return 0;
    
    const start = new Date(startTime);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    return diffInHours;
  };

  if (loading) {
    return (
      <div className="saved-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-container">
      <header className="app-header">
        <div className="logo">
          <img src="/crown-logo.png" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/')}>Inicio</button>
          <button className="nav-item" onClick={() => navigate('/players')}>Gamers</button>
          <button className="nav-item active">Salvos</button>
        </nav>
      </header>

      <main className="saved-content">
        <div className="title-section">
          <h1>JOGOS SALVOS</h1>
          <div className="title-actions">
            <p>{matches.length.toString().padStart(2, '0')} JOGOS</p>
            <button className="new-game-button" onClick={() => navigate('/create-game')}>
              Novo Jogo
            </button>
          </div>
        </div>

        <div className="saved-games-grid">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadMatches}>Tentar Novamente</button>
            </div>
          )}

          {matches.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum jogo salvo ainda</p>
            </div>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="game-card" onClick={() => handleOpenGame(match)}>
                <div className="crown-icon">
                  <img src="/crown-logo.png" alt="Crown" />
                </div>
                <h2>{match.name}</h2>
                <p>{calculatePlayTime(match.startTime)} HORAS JOGADAS</p>
                <div className="game-stats">
                  <div className="stat">
                    <img src="/avatar-placeholder.svg" alt="Player" className="player-avatar" />
                    <span>{match.players.length.toString().padStart(2, '0')}</span>
                  </div>
                  <div className="stat">
                    <div className="time-icon">
                      <img src="/clock-icon.svg" alt="Time" />
                    </div>
                    <span>{match.round.toString().padStart(2, '0')}</span>
                  </div>
                  <button className="delete-button" onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(match.id);
                  }}>
                    <img src="/delete-icon.svg" alt="Delete" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedGames; 
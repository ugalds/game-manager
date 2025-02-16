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
      const data = await response.data;
      
      // Garante que os dados dos jogadores estejam completos
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
      if (error.message === 'Network Error') {
        setError('Não foi possível conectar ao servidor. Verifique se o servidor está rodando.');
      } else if (error.response) {
        setError(`Erro ao carregar jogos: ${error.response.data.message || 'Erro desconhecido'}`);
      } else {
        setError('Erro ao carregar jogos. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setGameToDelete(id);
  };

  const confirmDelete = async (id: number) => {
    try {
      await api.delete(`/matches/${id}`);
      await loadMatches();
      setGameToDelete(null);
    } catch (error: any) {
      console.error('Erro ao deletar jogo:', error);
      let errorMessage = 'Erro ao deletar jogo. Por favor, tente novamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in_progress':
        return '🎮';
      case 'finished':
        return '🏆';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
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
      let errorMessage = 'Erro ao abrir jogo. Por favor, tente novamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Jogos Salvos ({matches.length})</h1>
        <div className="tabs">
          <div className="tab" onClick={() => navigate('/')}>Início</div>
          <div className="tab" onClick={() => navigate('/players')}>Gamers</div>
          <div className="tab active">Salvos</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadMatches} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      )}

      <div className="game-list">
        {matches.length === 0 ? (
          <div className="no-games">
            <p>Nenhum jogo salvo encontrado</p>
            <button onClick={() => navigate('/create-game')} className="create-game-button">
              Criar Novo Jogo
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <div 
              key={match.id} 
              className="game-card"
              onClick={() => handleOpenGame(match)}
            >
              <div className="game-info">
                <div className="crown-icon">👑</div>
                <div className="game-text">
                  <h2>{match.name}</h2>
                  <p>Criado em: {formatDate(match.date)}</p>
                  <div className="players-preview">
                    {match.players.map((player, index) => (
                      <span key={player.id} className="player-tag">
                        {player.name}
                        {index < match.players.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="game-actions">
                <div className="status-badge" title={getStatusText(match.status)}>
                  {getStatusIcon(match.status)}
                  <span className="status-text">{getStatusText(match.status)}</span>
                </div>
                <div className="remove-game-container">
                  <div 
                    className="icon delete" 
                    onClick={(e) => handleDelete(e, match.id)}
                    title="Excluir jogo"
                  >
                    ✕
                  </div>
                  {gameToDelete === match.id && (
                    <div className="remove-confirmation">
                      <p>Excluir {match.name}?</p>
                      <div className="confirmation-buttons">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(match.id);
                          }}
                          className="confirm"
                        >
                          Sim
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setGameToDelete(null);
                          }}
                          className="cancel"
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        className="fab"
        onClick={() => navigate('/create-game')}
        title="Criar Novo Jogo"
      >
        +
      </button>
    </div>
  );
};

export default SavedGames; 
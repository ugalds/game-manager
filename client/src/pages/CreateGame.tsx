import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './CreateGame.css';
import logo from '../assets/logo.svg';
import closeIcon from '../assets/close.svg';
import addIcon from '../assets/add.svg';
import removeIcon from '../assets/remove.svg';

interface Player {
  id: number;
  name: string;
  avatar: string;
  wins?: number;
  losses?: number;
}

const CreateGame = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/players');
      setAvailablePlayers(response.data);
    } catch (err) {
      setError('Erro ao carregar jogadores. Por favor, tente novamente.');
      console.error('Erro ao carregar jogadores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/saved-games');
  };

  const togglePlayer = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const isFormValid = gameName.trim() !== '' && selectedPlayers.length >= 2;

  const handleCreateGame = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/matches', {
        name: gameName,
        date: new Date().toISOString(),
        status: 'pending',
        players: selectedPlayers.map(player => ({
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          points: 0,
          categories: {}
        })),
        round: 1
      });
      
      navigate(`/marker/${response.data.id}`);
    } catch (err) {
      setError('Erro ao criar jogo. Por favor, tente novamente.');
      console.error('Erro ao criar jogo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && availablePlayers.length === 0) {
    return (
      <div className="create-game-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando jogadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-game-container">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <button className="close-button" onClick={handleClose}>
          <img src={closeIcon} alt="Fechar" />
        </button>
      </div>

      <div className="content">
        <div className="left-section">
          <h1>Criar Novo Jogo</h1>
          <p>Preencha as informações abaixo para começar um novo jogo</p>
          <div className="dice-image">
            <img src="/dice-cup.png" alt="Dados" />
          </div>
        </div>

        <div className="middle-section">
          <h2 className="section-title">Informações do Jogo</h2>
          
          <div className="input-section">
            <label htmlFor="gameName">Nome do Marcador</label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Digite o nome do marcador"
            />
          </div>

          <div className="selected-players">
            <h3>Jogadores Selecionados</h3>
            {selectedPlayers.map(player => (
              <div key={player.id} className="player-item">
                <div className="player-avatar">{player.avatar}</div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                </div>
                <button 
                  className="remove-player" 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayer(player);
                  }}
                >
                  <img src={removeIcon} alt="Remover jogador" />
                </button>
              </div>
            ))}
          </div>

          <button 
            className="primary-button" 
            onClick={handleCreateGame}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Criando...' : 'Criar Jogo'}
          </button>
        </div>

        <div className="right-section">
          <h2 className="section-title">Adicionar Jogadores</h2>
          <div className="players-list">
            {availablePlayers
              .filter(player => !selectedPlayers.find(p => p.id === player.id))
              .map(player => (
                <div
                  key={player.id}
                  className="player-item"
                  onClick={() => togglePlayer(player)}
                >
                  <div className="player-avatar">{player.avatar}</div>
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    <span className="player-subtitle">Clique para adicionar</span>
                  </div>
                  <button className="add-player">
                    <img src={addIcon} alt="Adicionar jogador" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default CreateGame;
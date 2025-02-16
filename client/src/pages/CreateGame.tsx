import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './CreateGame.css';

interface Player {
  id: number;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
}

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [formError, setFormError] = useState<string | null>(null);

  const avatarOptions = ['👤', '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪'];

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleStartGame = async () => {
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    if (selectedPlayers.length < 2) {
      setError('Please select at least 2 players');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/matches', {
        name: gameName,
        players: selectedPlayers.map(player => ({
          id: player.id,
          name: player.name,
          avatar: player.avatar
        }))
      });
      
      navigate(`/game/${response.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      setFormError('Please enter a player name');
      return;
    }

    try {
      setLoading(true);
      setFormError(null);
      const response = await api.post('/players', {
        name: newPlayerName,
        avatar: selectedAvatar
      });
      
      setPlayers([...players, response.data]);
      setShowAddPlayerModal(false);
      setNewPlayerName('');
      setSelectedAvatar('👤');
    } catch (err: any) {
      setFormError(err.message || 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Create New Game</div>
        <div className="close-button" onClick={handleClose}>×</div>
      </header>

      <main className="main">
        <section className="game-name-section">
          <div className="subtitle">Game Name</div>
          <div className="input-container">
            <input
              type="text"
              className="game-name-input"
              placeholder="Enter game name..."
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
        </section>

        <section className="players-section">
          <div className="subtitle-container">
            <div className="subtitle">Select Players</div>
            <div className="player-count">
              {selectedPlayers.length}/4 players selected
              <div className="add-player-button" onClick={() => setShowAddPlayerModal(true)}>+</div>
            </div>
          </div>

          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              Loading players...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
              <button className="close-error" onClick={() => setError(null)}>×</button>
            </div>
          )}

          {!loading && !error && players.length === 0 && (
            <div className="empty-message">
              No players available
              <button className="add-first-player" onClick={() => setShowAddPlayerModal(true)}>
                Add Your First Player
              </button>
            </div>
          )}

          {!loading && !error && players.length > 0 && (
            <div className="players-list">
              {players.map(player => (
                <div
                  key={player.id}
                  className={`player-item ${selectedPlayers.find(p => p.id === player.id) ? 'selected' : ''}`}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="player-avatar">{player.avatar}</div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-stats">
                      {player.wins}W - {player.losses}L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="start-game-container">
          <button
            className={`start-game-button ${selectedPlayers.length >= 2 && gameName.trim() ? 'enabled' : 'disabled'}`}
            onClick={handleStartGame}
            disabled={selectedPlayers.length < 2 || !gameName.trim()}
          >
            Start Game
          </button>
        </div>
      </main>

      {showAddPlayerModal && (
        <div className="modal-overlay" onClick={() => setShowAddPlayerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add New Player</h2>
            
            {formError && (
              <div className="form-error">
                {formError}
                <button className="close-error" onClick={() => setFormError(null)}>×</button>
              </div>
            )}

            <div className="form-group">
              <label>Player Name</label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name..."
              />
            </div>

            <div className="form-group">
              <label>Select Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map(avatar => (
                  <div
                    key={avatar}
                    className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={() => setShowAddPlayerModal(false)}>
                Cancel
              </button>
              <button className="save-button" onClick={handleAddPlayer}>
                Add Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGame;
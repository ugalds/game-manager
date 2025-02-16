import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './Players.css';

interface Player {
  id?: number;
  name: string;
  avatar: string;
  points: number;
  wins: number;
  losses: number;
  rounds: number;
  general: number;
  generalBoca: number;
  riscos: number;
}

interface FormData {
  name: string;
  avatar: string;
}

const Players: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatar: '👤' });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', avatar: '' });

  const avatarOptions = [
    '👤', '👩', '👨', '🧑', 
    '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', 
    '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲',
    '🧔', '🧔‍♂️', '🧔‍♀️', '👲',
    '👸', '🤴', '👼', '🧙‍♀️',
    '🧙‍♂️', '🧚‍♀️', '🧚‍♂️', '🦸‍♀️',
    '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '🧛‍♀️',
    '🧛‍♂️', '🧜‍♀️', '🧜‍♂️', '🧝‍♀️'
  ];

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const response = await api.get('/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        alert('Por favor, insira o nome do jogador');
        return;
      }
      
      const newPlayer = {
        ...formData,
        points: 0,
        wins: 0,
        losses: 0,
        rounds: 0,
        general: 0,
        generalBoca: 0,
        riscos: 0
      };

      await api.post('/api/players', newPlayer);
      await loadPlayers();
      setFormData({ name: '', avatar: '👤' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const formatPosition = (position: number) => {
    return `GAMER ${position.toString().padStart(2, '0')}`;
  };

  const getPlayerPosition = (playerId: number) => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    const position = sortedPlayers.findIndex(p => p.id === playerId) + 1;
    return formatPosition(position);
  };

  const handleEdit = (player: Player) => {
    setEditFormData({ name: player.name, avatar: player.avatar });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editFormData.name.trim()) {
        alert('Por favor, insira o nome do jogador');
        return;
      }

      await api.put(`/api/players/${selectedPlayer?.id}`, editFormData);
      await loadPlayers();
      setShowEditForm(false);
      setSelectedPlayer(prev => prev ? { ...prev, ...editFormData } : null);
    } catch (error) {
      console.error('Erro ao editar jogador:', error);
    }
  };

  const handleDelete = async (playerId: number) => {
    try {
      await api.delete(`/api/players/${playerId}`);
      await loadPlayers();
      setSelectedPlayer(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
    }
  };

  // Modificar o useEffect do handleClickOutside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const addForm = target.closest('.add-player-form');
      const addButton = target.closest('.add-player-button');
      const editForm = target.closest('.edit-form');
      const editButton = target.closest('.edit-button');
      const deleteConfirm = target.closest('.remove-confirmation');
      const deleteButton = target.closest('.delete-button');

      if (!addForm && !addButton && showAddForm) {
        setShowAddForm(false);
      }
      if (!deleteConfirm && !deleteButton && showDeleteConfirm) {
        setShowDeleteConfirm(false);
      }
      if (!editForm && !editButton && showEditForm) {
        setShowEditForm(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAddForm, showDeleteConfirm, showEditForm]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <img src="/crown-logo.png" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/')}>Início</button>
          <button className="nav-item active">Gamers</button>
          <button className="nav-item" onClick={() => navigate('/saved-games')}>Salvos</button>
        </nav>
      </header>

      <main className="main-content">
        <div className="title-section">
          <h1>GAMERS</h1>
          <p>{players.length} JOGADORES</p>
        </div>

        <div className="content-grid">
          <section className="players-section">
            <div className="section-header">
              <div className="header-left">
                <h2>Jogadores</h2>
              </div>
              <div className="add-player-container">
                <button 
                  className="add-player-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddForm(!showAddForm);
                  }}
                >
                  ➕
                </button>
                {showAddForm && (
                  <>
                    <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                      <div className="add-player-form" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-button" onClick={() => setShowAddForm(false)}>×</button>
                        <div className="player-form">
                          <h2>NOVO JOGADOR</h2>
                          <p className="form-subtitle">GAMER</p>
                          <form onSubmit={handleSubmit}>
                            <div className="form-group">
                              <label>Avatar</label>
                              <div className="avatar-options">
                                {avatarOptions.map((avatar) => (
                                  <button
                                    key={avatar}
                                    type="button"
                                    className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, avatar })}
                                  >
                                    {avatar}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Nome Jogador</label>
                              <input
                                type="text"
                                placeholder="NOME JOGADOR"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                            <button type="submit" className="submit-button">
                              Adicionar
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="players-list">
              {players.map((player, index) => (
                <div 
                  key={player.id} 
                  className="player-item"
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="player-number">Gamer {String(index + 1).padStart(2, '0')}</div>
                  <div className="player-content">
                    <div className="player-avatar">
                      {player.avatar || '👤'}
                    </div>
                    <div className="player-info">
                      <h3>{player.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal stats-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="profile">
                <div className="player-avatar">
                  {selectedPlayer.avatar || '👤'}
                </div>
                <div>
                  <h3>{selectedPlayer.name}</h3>
                  <p>{getPlayerPosition(selectedPlayer.id!)}</p>
                </div>
              </div>
              <div className="modal-header-actions">
                <button 
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(selectedPlayer);
                  }}
                >
                  ✏️
                </button>
                {selectedPlayer && showEditForm && (
                  <>
                    <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
                      <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-button" onClick={() => setShowEditForm(false)}>×</button>
                        <div className="player-form">
                          <h2>EDITAR JOGADOR</h2>
                          <p className="form-subtitle">GAMER {getPlayerPosition(selectedPlayer.id!)}</p>
                          <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                              <label>Avatar</label>
                              <div className="avatar-options">
                                {avatarOptions.map((avatar) => (
                                  <button
                                    key={avatar}
                                    type="button"
                                    className={`avatar-option ${editFormData.avatar === avatar ? 'selected' : ''}`}
                                    onClick={() => setEditFormData({ ...editFormData, avatar })}
                                  >
                                    {avatar}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Nome Jogador</label>
                              <input
                                type="text"
                                placeholder="NOME JOGADOR"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                              />
                            </div>
                            <button type="submit" className="submit-button">
                              Salvar Alterações
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="delete-button-container">
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(!showDeleteConfirm);
                    }}
                  >
                    🗑️
                  </button>
                  {showDeleteConfirm && (
                    <div className="remove-confirmation">
                      <p>Tem certeza que deseja excluir este jogador?</p>
                      <div className="confirmation-buttons">
                        <button 
                          className="confirm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(selectedPlayer.id!);
                          }}
                        >
                          Confirmar
                        </button>
                        <button 
                          className="cancel"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(false);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  className="close-button"
                  onClick={() => setSelectedPlayer(null)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="modal-content">
              <div className="points">
                <div className="points-icon">⏱️</div>
                {selectedPlayer.points.toLocaleString()} PONTOS ACUMULADOS
              </div>
              <div className="stats">
                <div>
                  <div className="stats-icon">👑</div>
                  <div>
                    <strong>{selectedPlayer.wins}</strong>
                    <span>VITÓRIAS</span>
                  </div>
                </div>
                <div>
                  <div className="stats-icon">🔄</div>
                  <div>
                    <strong>{selectedPlayer.rounds}</strong>
                    <span>RODADAS JOGADAS</span>
                  </div>
                </div>
              </div>
              <div className="bar-container">
                <div className="bar-label">{selectedPlayer.generalBoca} GENERAL DE BOCA</div>
                <div className="bar">
                  <span style={{ width: `${Math.min((selectedPlayer.generalBoca / 10) * 100, 100)}%` }}></span>
                </div>
                <div className="bar-label">{selectedPlayer.general} GENERAL</div>
                <div className="bar">
                  <span style={{ width: `${Math.min((selectedPlayer.general / 30) * 100, 100)}%` }}></span>
                </div>
                <div className="bar-label">{selectedPlayer.riscos} RISCOS</div>
                <div className="bar">
                  <span style={{ width: `${Math.min((selectedPlayer.riscos / 50) * 100, 100)}%` }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players; 
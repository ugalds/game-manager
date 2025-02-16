import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Round {
  id: number;
  number: number;
  matchId: number;
  status: 'pending' | 'in_progress' | 'finished';
}

type RoundStatus = Round['status'];

interface Match {
  id: number;
  name: string;
}

const Rounds: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [formData, setFormData] = useState<{
    number: string;
    matchId: string;
    status: RoundStatus;
  }>({
    number: '',
    matchId: '',
    status: 'pending'
  });

  useEffect(() => {
    loadRounds();
    loadMatches();
  }, []);

  const loadRounds = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/rounds');
      const data = await response.json();
      setRounds(data);
    } catch (error) {
      console.error('Erro ao carregar rodadas:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRound
        ? `http://localhost:3002/api/rounds/${editingRound.id}`
        : 'http://localhost:3002/api/rounds';

      const response = await fetch(url, {
        method: editingRound ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: parseInt(formData.number),
          matchId: parseInt(formData.matchId),
          status: formData.status,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingRound(null);
        setFormData({ number: '', matchId: '', status: 'pending' });
        loadRounds();
      }
    } catch (error) {
      console.error('Erro ao salvar rodada:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta rodada?')) {
      try {
        const response = await fetch(`http://localhost:3002/api/rounds/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadRounds();
        }
      } catch (error) {
        console.error('Erro ao deletar rodada:', error);
      }
    }
  };

  const handleEdit = (round: Round) => {
    setEditingRound(round);
    setFormData({
      number: round.number.toString(),
      matchId: round.matchId.toString(),
      status: round.status
    });
    setShowForm(true);
  };

  const getStatusText = (status: Round['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'finished':
        return 'Finalizada';
      default:
        return status;
    }
  };

  return (
    <div className="container">
      <h1>Rodadas</h1>
      <Link to="/" className="back-link">Voltar para Home</Link>

      <button 
        className="add-button"
        onClick={() => {
          setEditingRound(null);
          setFormData({ number: '', matchId: '', status: 'pending' });
          setShowForm(true);
        }}
      >
        Adicionar Rodada
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Número:</label>
            <input
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Partida:</label>
            <select
              value={formData.matchId}
              onChange={(e) => setFormData({ ...formData, matchId: e.target.value })}
              required
            >
              <option value="">Selecione uma partida</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Round['status'] })}
              required
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="finished">Finalizada</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">
              {editingRound ? 'Atualizar' : 'Criar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="list">
        {rounds.map((round) => (
          <div key={round.id} className="list-item">
            <div className="item-info">
              <h3>Rodada {round.number}</h3>
              <p>Partida: {matches.find(m => m.id === round.matchId)?.name}</p>
              <p>Status: {getStatusText(round.status)}</p>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(round)}>Editar</button>
              <button onClick={() => handleDelete(round.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rounds; 
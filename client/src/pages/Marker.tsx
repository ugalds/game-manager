import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './Marker.css';

interface Player {
  id: number;
  name: string;
  avatar: string;
  points?: number;
  categories?: { [key: string]: number };
  victories?: number;
  rounds?: number;
  general?: number;
  generalBoca?: number;
  riscos?: number;
}

interface Match {
  id: number;
  name: string;
  players: Player[];
  current_player: number;
  status: string;
  round: number;
  start_time?: string;
}

interface DragResult {
  destination?: {
    index: number;
  };
  source: {
    index: number;
  };
}

interface ScoreOption {
  points: number;
  label: string;
  hidePoints?: boolean;
}

interface CategoryConfig {
  title: string;
  description: string;
  options: ScoreOption[];
}

interface CategoryState {
  points: number;
  crossed: boolean;
}

interface MatchStats {
  points: number;
  riscos: number;
  general: number;
  generalBoca: number;
  victories: number;
  rounds: number;
}

const CATEGORY_CONFIGS: { [key: string]: CategoryConfig } = {
  as: {
    title: 'ÁS',
    description: 'Dados 01',
    options: [
      { points: 1, label: 'Ponto' },
      { points: 2, label: 'Pontos' },
      { points: 3, label: 'Pontos' },
      { points: 4, label: 'Pontos' },
      { points: 5, label: 'Pontos' },
    ]
  },
  duque: {
    title: 'DUQUE',
    description: 'Dados 02',
    options: [
      { points: 2, label: 'Pontos' },
      { points: 4, label: 'Pontos' },
      { points: 6, label: 'Pontos' },
      { points: 8, label: 'Pontos' },
      { points: 10, label: 'Pontos' },
    ]
  },
  terno: {
    title: 'TERNO',
    description: 'Dados 03',
    options: [
      { points: 3, label: 'Pontos' },
      { points: 6, label: 'Pontos' },
      { points: 9, label: 'Pontos' },
      { points: 12, label: 'Pontos' },
      { points: 15, label: 'Pontos' },
    ]
  },
  quadra: {
    title: 'QUADRA',
    description: 'Dados 04',
    options: [
      { points: 4, label: 'Pontos' },
      { points: 8, label: 'Pontos' },
      { points: 12, label: 'Pontos' },
      { points: 16, label: 'Pontos' },
      { points: 20, label: 'Pontos' },
    ]
  },
  quina: {
    title: 'QUINA',
    description: 'Dados 05',
    options: [
      { points: 5, label: 'Pontos' },
      { points: 10, label: 'Pontos' },
      { points: 15, label: 'Pontos' },
      { points: 20, label: 'Pontos' },
      { points: 25, label: 'Pontos' },
    ]
  },
  sena: {
    title: 'SENA',
    description: 'Dados 06',
    options: [
      { points: 6, label: 'Pontos' },
      { points: 12, label: 'Pontos' },
      { points: 18, label: 'Pontos' },
      { points: 24, label: 'Pontos' },
      { points: 30, label: 'Pontos' },
    ]
  },
  full: {
    title: 'FULL',
    description: 'Três dados iguais + dois dados iguais',
    options: [
      { points: 10, label: 'Pontos' },
      { points: 15, label: 'Pontos' },
    ]
  },
  sequencia: {
    title: 'SEQUÊNCIA',
    description: 'Cinco dados em sequência',
    options: [
      { points: 20, label: 'Pontos' },
      { points: 25, label: 'Pontos' },
    ]
  },
  quadrada: {
    title: 'QUADRADA',
    description: 'Quatro dados iguais',
    options: [
      { points: 30, label: 'Pontos' },
      { points: 35, label: 'Pontos' },
    ]
  },
  general: {
    title: 'GENERAL',
    description: 'Cinco dados iguais',
    options: [
      { points: 40, label: 'Pontos' },
      { points: 1000, label: 'Boca', hidePoints: true },
    ]
  }
};

const Marker: React.FC = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [playerFormData, setPlayerFormData] = useState<Player>({ id: 0, name: '', avatar: '👤' });
  const [isEditing, setIsEditing] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);
  const [playerToDeleteFromList, setPlayerToDeleteFromList] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [lastMove, setLastMove] = useState<{
    playerId: number;
    category: string;
    points: number;
  } | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/matches/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar partida');
      }
      
      const matchData = await response.json();
      
      // Buscar dados completos dos jogadores
      const playersResponse = await fetch('http://localhost:3002/api/players');
      if (!playersResponse.ok) {
        throw new Error('Erro ao carregar jogadores');
      }
      
      const allPlayers = await playersResponse.json();
      
      // Mapear os jogadores da partida mantendo as pontuações existentes
      if (matchData.players) {
        matchData.players = matchData.players
          .filter((matchPlayer: any) => {
            return allPlayers.some((p: Player) => p.id === matchPlayer.id);
          })
          .map((matchPlayer: any) => {
            const fullPlayer = allPlayers.find((p: Player) => p.id === matchPlayer.id);
            
            return {
              id: matchPlayer.id,
              name: fullPlayer.name,
              avatar: fullPlayer.avatar,
              points: matchPlayer.points || 0,
              categories: matchPlayer.categories || {}
            };
          });
      }
      
      // Se a partida estiver pendente ou não tiver start_time, inicia o timer
      if (matchData.status === 'pending' || !matchData.start_time) {
        const now = new Date().toISOString();
        matchData.start_time = now;
        matchData.status = 'in_progress';
        
        await fetch(`http://localhost:3002/api/matches/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            ...matchData,
            status: 'in_progress',
            start_time: now
          }),
        });
      }
      
      // Sempre inicia o timer com o start_time existente ou o novo
      if (matchData.start_time) {
        startTimer(matchData.start_time);
      }
      
      // Seleciona o primeiro jogador se houver jogadores
      const firstPlayer = matchData.players && matchData.players.length > 0 ? matchData.players[0] : null;
      
      // Atualiza o estado do match com todos os dados necessários
      setMatch({
        ...matchData,
        round: matchData.round || 1,
        current_player: firstPlayer ? firstPlayer.id : matchData.current_player,
        players: matchData.players || [],
        start_time: matchData.start_time // Garante que o start_time seja mantido
      });

      // Sempre seleciona o primeiro jogador
      if (firstPlayer) {
        setCurrentPlayer(firstPlayer);
      }

    } catch (error) {
      console.error('Erro ao carregar partida:', error);
      alert('Erro ao carregar partida. Por favor, tente novamente.');
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      // Busca todos os jogadores do banco de dados
      const response = await fetch('http://localhost:3002/api/players');
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores');
      }
      
      const allPlayers = await response.json();
      
      // Filtra os jogadores que já estão na partida
      const availablePlayers = allPlayers.filter((player: Player) => {
        return !match?.players.some(matchPlayer => matchPlayer.id === player.id);
      });
      
      // Ordena os jogadores por nome
      const sortedPlayers = availablePlayers.sort((a: Player, b: Player) => 
        a.name.localeCompare(b.name)
      );
      
      // Atualiza o estado com os jogadores disponíveis
      setAvailablePlayers(sortedPlayers);
      
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      alert('Erro ao carregar lista de jogadores. Por favor, tente novamente.');
    }
  };

  const initializeMatch = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/matches/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar partida');
      }
      
      const matchData = await response.json();
      
      // Buscar dados completos dos jogadores
      const playersResponse = await fetch('http://localhost:3002/api/players');
      if (!playersResponse.ok) {
        throw new Error('Erro ao carregar jogadores');
      }
      
      const allPlayers = await playersResponse.json();
      
      // Mapear os jogadores da partida mantendo as pontuações existentes
      if (matchData.players) {
        matchData.players = matchData.players
          .filter((matchPlayer: any) => {
            return allPlayers.some((p: Player) => p.id === matchPlayer.id);
          })
          .map((matchPlayer: any) => {
            const fullPlayer = allPlayers.find((p: Player) => p.id === matchPlayer.id);
            
            return {
              id: matchPlayer.id,
              name: fullPlayer.name,
              avatar: fullPlayer.avatar,
              points: matchPlayer.points || 0,
              categories: matchPlayer.categories || {}
            };
          });
      }
      
      // Se a partida estiver pendente ou não tiver start_time, inicia o timer
      if (matchData.status === 'pending' || !matchData.start_time) {
        const now = new Date().toISOString();
        matchData.start_time = now;
        matchData.status = 'in_progress';
        
        await fetch(`http://localhost:3002/api/matches/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            ...matchData,
            status: 'in_progress',
            start_time: now
          }),
        });
      }

      // Sempre inicia o timer com o start_time existente ou o novo
      if (matchData.start_time) {
        startTimer(matchData.start_time);
      }
      
      // Seleciona o primeiro jogador se houver jogadores
      const firstPlayer = matchData.players && matchData.players.length > 0 ? matchData.players[0] : null;
      
      // Atualiza o estado do match com todos os dados necessários
      setMatch({
        ...matchData,
        round: matchData.round || 1,
        current_player: firstPlayer ? firstPlayer.id : matchData.current_player,
        players: matchData.players || [],
        start_time: matchData.start_time // Garante que o start_time seja mantido
      });

      // Sempre seleciona o primeiro jogador ao inicializar
      if (firstPlayer) {
        setCurrentPlayer(firstPlayer);
      }
      
      return matchData;
    } catch (error) {
      console.error('Erro ao carregar partida:', error);
      alert('Erro ao carregar partida. Por favor, tente novamente.');
      return null;
    }
  };

  useEffect(() => {
    const initializeMatch = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/matches/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar partida');
        }
        
        const matchData = await response.json();
        
        // Buscar dados completos dos jogadores
        const playersResponse = await fetch('http://localhost:3002/api/players');
        if (!playersResponse.ok) {
          throw new Error('Erro ao carregar jogadores');
        }
        
        const allPlayers = await playersResponse.json();
        
        // Mapear os jogadores da partida mantendo as pontuações existentes
        if (matchData.players) {
          matchData.players = matchData.players
            .filter((matchPlayer: any) => {
              return allPlayers.some((p: Player) => p.id === matchPlayer.id);
            })
            .map((matchPlayer: any) => {
              const fullPlayer = allPlayers.find((p: Player) => p.id === matchPlayer.id);
              
              return {
                id: matchPlayer.id,
                name: fullPlayer.name,
                avatar: fullPlayer.avatar,
                points: matchPlayer.points || 0,
                categories: matchPlayer.categories || {}
              };
            });
        }

        // Se a partida estiver pendente ou não tiver start_time, inicia o timer
        if (matchData.status === 'pending' || !matchData.start_time) {
          const now = new Date().toISOString();
          matchData.start_time = now;
          matchData.status = 'in_progress';
          
          await fetch(`http://localhost:3002/api/matches/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              ...matchData,
              status: 'in_progress',
              start_time: now
            }),
          });
        }

        // Sempre inicia o timer com o start_time existente ou o novo
        if (matchData.start_time) {
          startTimer(matchData.start_time);
        }

        // Seleciona o primeiro jogador se houver jogadores
        const firstPlayer = matchData.players && matchData.players.length > 0 ? matchData.players[0] : null;
        
        // Atualiza o estado do match com todos os dados necessários
        setMatch({
          ...matchData,
          round: matchData.round || 1,
          current_player: firstPlayer ? firstPlayer.id : matchData.current_player,
          players: matchData.players || [],
          start_time: matchData.start_time // Garante que o start_time seja mantido
        });

        // Sempre seleciona o primeiro jogador ao inicializar
        if (firstPlayer) {
          setCurrentPlayer(firstPlayer);
        }
        
        return matchData;
      } catch (error) {
        console.error('Erro ao carregar partida:', error);
        alert('Erro ao carregar partida. Por favor, tente novamente.');
        return null;
      }
    };

    initializeMatch();

    // Configura o intervalo para recarregar dados
    const interval = setInterval(() => {
      if (!isFirstLoad) { // Só atualiza periodicamente após a primeira carga
        fetchMatch();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [id]);

  // Adiciona um useEffect para carregar os jogadores quando o componente montar
  useEffect(() => {
    fetchAvailablePlayers();
  }, []); // Executa apenas uma vez ao montar o componente

  // Adiciona um useEffect para atualizar a lista quando os jogadores da partida mudarem
  useEffect(() => {
    if (showAddPlayerModal) {
      fetchAvailablePlayers();
    }
  }, [showAddPlayerModal, match?.players]);

  // Adiciona useEffect para verificar se todos os marcadores estão preenchidos
  useEffect(() => {
    if (match && !showEndGameModal && !isFirstLoad && checkAllButtonsFilled()) {
      setShowEndGameModal(true);
    }
  }, [match?.players, isFirstLoad]);

  // Adiciona useEffect para parar o timer quando o modal de fim de jogo é aberto
  useEffect(() => {
    if (showEndGameModal && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [showEndGameModal]);

  const handleClose = async () => {
    if (!match) return;

    try {
      // Para o timer
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }

      // Zera as pontuações dos jogadores mas mantém o start_time
      const updatedPlayers = match.players.map(player => ({
        ...player,
        points: 0,
        categories: {}
      }));

      // Atualiza o status da partida para in_progress e zera as pontuações
      await fetch(`http://localhost:3002/api/matches/${match.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...match,
          status: 'in_progress',
          players: updatedPlayers,
          start_time: match.start_time // Mantém o start_time original
        }),
      });

      // Redireciona para a lista de jogos salvos
      navigate('/saved-games');
    } catch (error) {
      console.error('Erro ao salvar status da partida:', error);
      // Mesmo com erro, redireciona o usuário
      navigate('/saved-games');
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    if (!match) return;
    
    try {
      // Encontra o jogador que será removido
      const playerToRemove = match.players.find(p => p.id === playerId);
      if (!playerToRemove) return;

      // Filtra o jogador da lista
      const updatedPlayers = match.players.filter(p => p.id !== playerId);
      
      // Atualiza no banco de dados apenas a lista de jogadores da partida
      const response = await fetch(`http://localhost:3002/api/matches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...match,
          players: updatedPlayers.map(p => ({
            id: p.id,
            points: p.points || 0,
            categories: p.categories || {}
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover jogador da partida');
      }

      // Atualiza o estado local
      setMatch({
        ...match,
        players: updatedPlayers
      });

      // Se o jogador removido era o jogador atual, limpa o estado
      if (currentPlayer?.id === playerId) {
        setCurrentPlayer(null);
      }

      // Recarrega os dados da partida e jogadores disponíveis
      await fetchMatch();
      await fetchAvailablePlayers();
      
      // Fecha o menu de confirmação
      setPlayerToDeleteFromList(null);
      setMenuPosition(null);
    } catch (error) {
      console.error('Erro ao remover jogador da partida:', error);
      alert('Erro ao remover jogador da partida. Por favor, tente novamente.');
    }
  };

  const handleAddPlayer = async (player: Player) => {
    if (!match) return;
    
    try {
      // Cria uma cópia atualizada dos jogadores
      const updatedPlayers = [
        ...match.players,
        {
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          points: 0,
          categories: {}
        }
      ];
      
      // Atualiza o match localmente
      setMatch({
        ...match,
        players: updatedPlayers
      });

      // Atualiza no banco de dados
      const response = await fetch(`http://localhost:3002/api/matches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...match,
          players: updatedPlayers.map(p => ({
            id: p.id,
            points: p.points || 0,
            categories: p.categories || {}
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar jogador à partida');
      }
      
      // Recarrega os dados da partida
      await fetchMatch();
      await fetchAvailablePlayers();
      
      setShowAddPlayerModal(false);
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      alert('Erro ao adicionar jogador à partida. Por favor, tente novamente.');
    }
  };

  const handleCreateOrUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing) {
        response = await fetch(`http://localhost:3002/api/players/${playerFormData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playerFormData),
        });
      } else {
        response = await fetch('http://localhost:3002/api/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playerFormData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar jogador');
      }

      const savedPlayer = await response.json();
      
      // Se não estiver editando, adiciona o jogador à partida
      if (!isEditing) {
        await handleAddPlayer(savedPlayer);
      }
      
      // Recarrega a lista de jogadores disponíveis
      await fetchAvailablePlayers();
      
      setShowPlayerForm(false);
      setPlayerFormData({ id: 0, name: '', avatar: '👤' });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
      let errorMessage = 'Erro ao salvar jogador. Por favor, tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      alert(errorMessage);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setPlayerFormData(player);
    setIsEditing(true);
    setShowPlayerForm(true);
  };

  const handleDeletePlayer = async (playerId: number) => {
    try {
      // Primeiro, exclui o jogador da API
      await fetch(`http://localhost:3002/api/players/${playerId}`, {
        method: 'DELETE',
      });

      // Atualiza a lista de jogadores disponíveis
      await fetchAvailablePlayers();
      
      // Fecha o menu de confirmação
      setPlayerToDeleteFromList(null);
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
      alert('Erro ao excluir jogador. Por favor, tente novamente.');
    }
  };

  const handlePlayerClick = async (player: Player) => {
    if (!match) return;
    
    try {
      // Busca o jogador atual do match com suas pontuações
      const playerInMatch = match.players.find(p => p.id === player.id);
      if (!playerInMatch) return;

      // Atualiza o jogador atual no estado local mantendo todas as informações
      setCurrentPlayer(playerInMatch);
      
      // Atualiza o match com o novo jogador atual
      const updatedMatch = {
        ...match,
        current_player: player.id,
        players: match.players.map(p => ({
          ...p,
          points: p.points || 0,
          categories: p.categories || {}
        }))
      };

      setMatch(updatedMatch);

      // Atualiza no banco de dados
      await fetch(`http://localhost:3002/api/matches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedMatch,
          players: updatedMatch.players.map(p => ({
            id: p.id,
            points: p.points,
            categories: p.categories
          }))
        }),
      });

    } catch (error) {
      console.error('Erro ao atualizar jogador atual:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowScoreModal(true);
  };

  // Função para verificar se todos os botões estão preenchidos
  const checkAllButtonsFilled = () => {
    if (!match || !match.players || match.players.length === 0) return false;
    
    const allCategories = Object.keys(CATEGORY_CONFIGS);
    
    // Verifica se todos os jogadores têm todas as categorias preenchidas
    return match.players.every(player => {
      return allCategories.every(category => {
        // Verifica se a categoria existe e tem um valor (pontos ou risco)
        const categoryValue = player.categories?.[category];
        return categoryValue !== undefined && categoryValue !== null;
      });
    });
  };

  // Função para verificar se alguém fez general de boca
  const checkGeneralBoca = (playerId: number, category: string, points: number) => {
    return category === 'general' && points === 1000;
  };

  // Função para obter o jogador vencedor
  const getWinner = (): Player | null => {
    if (!match || !match.players || match.players.length === 0) return null;

    return match.players.reduce((winner: Player | null, player: Player) => {
      if (!winner) return player;
      return (player.points || 0) > (winner.points || 0) ? player : winner;
    }, null);
  };

  // Função para salvar as estatísticas do jogador
  const savePlayerStats = async (player: Player, isWinner: boolean) => {
    try {
      // Busca os dados atuais do jogador
      const response = await fetch(`http://localhost:3002/api/players/${player.id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogador');
      }

      const currentPlayer = await response.json();

      // Calcula as estatísticas
      const generalCount = Object.entries(player.categories || {}).filter(([category, points]) => 
        category === 'general' && points === 40
      ).length;

      const generalBocaCount = Object.entries(player.categories || {}).filter(([category, points]) => 
        category === 'general' && points === 1000
      ).length;

      const riscosCount = Object.values(player.categories || {}).filter(points => points === 0).length;

      // Atualiza as estatísticas do jogador
      const updatedPlayer = {
        ...currentPlayer,
        points: (currentPlayer.points || 0) + (player.points || 0),
        victories: isWinner ? (currentPlayer.victories || 0) + 1 : currentPlayer.victories || 0,
        rounds: (currentPlayer.rounds || 0) + 1,
        general: (currentPlayer.general || 0) + generalCount,
        generalBoca: (currentPlayer.generalBoca || 0) + generalBocaCount,
        riscos: (currentPlayer.riscos || 0) + riscosCount
      };

      // Tenta atualizar as estatísticas
      const updateResponse = await fetch(`http://localhost:3002/api/players/${player.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlayer),
      });

      if (!updateResponse.ok) {
        throw new Error('Erro ao atualizar estatísticas');
      }

    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
      alert('Erro ao salvar estatísticas do jogador. Por favor, tente novamente.');
    }
  };

  // Modifica a função handleScoreSelect para verificar fim de jogo
  const handleScoreSelect = async (points: number, isDelete: boolean = false) => {
    if (!match || !currentPlayer || !selectedCategory) return;

    try {
      // Busca o jogador atual do match
      const playerInMatch = match.players.find(p => p.id === currentPlayer.id);
      if (!playerInMatch) return;

      // Inicializa as categorias se não existirem
      const currentCategories = playerInMatch.categories || {};
      
      // Se for delete, remove a categoria
      // Se for riscar (points = 0), mantém a categoria com valor 0
      let updatedCategories = { ...currentCategories };
      if (isDelete) {
        delete updatedCategories[selectedCategory];
      } else {
        updatedCategories[selectedCategory] = points;
      }

      // Calcula a diferença de pontos
      const oldPoints = currentCategories[selectedCategory] || 0;
      const pointsDiff = isDelete ? -oldPoints : points - oldPoints;
      
      // Cria uma cópia atualizada do jogador
      const updatedPlayer: Player = {
        ...playerInMatch,
        points: Math.max(0, (playerInMatch.points || 0) + pointsDiff),
        categories: updatedCategories
      };

      // Atualiza o estado do match com o jogador atualizado
      const updatedPlayers = match.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      );

      // Atualiza o estado local do match
      const updatedMatch: Match = {
        ...match,
        players: updatedPlayers
      };
      setMatch(updatedMatch);

      // Atualiza o jogador atual no estado local
      setCurrentPlayer(updatedPlayer);

      // Atualiza o estado da partida no banco de dados
      const response = await fetch(`http://localhost:3002/api/matches/${match.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...match,
          players: updatedPlayers.map(p => ({
            id: p.id,
            points: p.points,
            categories: p.categories
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar pontuação');
      }
      
      // Verifica se é general de boca ou se todos os botões foram preenchidos
      if (checkGeneralBoca(currentPlayer.id, selectedCategory, points) || 
          (!isDelete && checkAllButtonsFilled())) {
        setLastMove({
          playerId: currentPlayer.id,
          category: selectedCategory,
          points: points
        });
        setShowScoreModal(false);
        setSelectedCategory(null);
        setShowEndGameModal(true);
        return;
      }

      // Fecha o modal
      setShowScoreModal(false);
      setSelectedCategory(null);

    } catch (error) {
      console.error('Erro ao atualizar pontuação:', error);
      alert('Erro ao atualizar pontuação. Por favor, tente novamente.');
    }
  };

  // Função para continuar jogando
  const handleContinueGame = () => {
    setShowEndGameModal(false);
    setIsFirstLoad(true);
    // Reinicia o timer com o start_time original
    if (match?.start_time) {
      startTimer(match.start_time);
    }
  };

  // Função para iniciar novo jogo
  const handleNewGame = async () => {
    if (!match) return;

    try {
      // Encontra o vencedor (jogador com mais pontos)
      const winner = match.players.reduce((prev, current) => {
        return (current.points || 0) > (prev.points || 0) ? current : prev;
      }, match.players[0]);

      // Salva as estatísticas apenas do vencedor
      if (winner) {
        await savePlayerStats(winner, true);
      }

      // Cria uma nova partida com os mesmos jogadores mas zerada
      const updatedPlayers = match.players.map(player => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        points: 0,
        categories: {}
      }));

      // Primeiro atualiza o banco de dados mantendo o start_time original
      const response = await fetch(`http://localhost:3002/api/matches/${match.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: match.id,
          name: match.name,
          status: 'in_progress',
          current_player: updatedPlayers[0].id,
          players: updatedPlayers,
          round: (match.round || 1) + 1, // Incrementa o número da rodada
          start_time: match.start_time // Mantém o start_time original
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao reiniciar o jogo');
      }

      // Depois atualiza o estado local mantendo o start_time
      setMatch({
        ...match,
        players: updatedPlayers,
        current_player: updatedPlayers[0].id,
        status: 'in_progress',
        round: (match.round || 1) + 1 // Incrementa o número da rodada
      });
      setCurrentPlayer(updatedPlayers[0]);
      setShowEndGameModal(false);
      setIsFirstLoad(false);

      // Reinicia o timer com o start_time original
      if (match.start_time) {
        startTimer(match.start_time);
      }

      // Por fim, força uma nova busca dos dados
      await fetchMatch();
    } catch (error) {
      console.error('Erro ao criar novo jogo:', error);
      alert('Erro ao criar novo jogo. Por favor, tente novamente.');
    }
  };

  // Função para finalizar o jogo
  const handleEndGame = async (saveStats: boolean) => {
    if (!match) return;

    try {
      // Para o timer
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }

      if (saveStats) {
        const winner = getWinner();
        // Salva estatísticas para cada jogador
        for (const player of match.players) {
          await savePlayerStats(player, player.id === winner?.id);
        }
      }

      // Zera as pontuações dos jogadores mas mantém o start_time
      const updatedPlayers = match.players.map(player => ({
        ...player,
        points: 0,
        categories: {}
      }));

      // Atualiza o status da partida para finalizada e zera as pontuações
      await fetch(`http://localhost:3002/api/matches/${match.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...match,
          status: 'finished',
          players: updatedPlayers,
          round: (match.round || 1) + 1,
          start_time: match.start_time // Mantém o start_time original
        }),
      });

      // Redireciona para a lista de jogos salvos
      navigate('/');
    } catch (error) {
      console.error('Erro ao finalizar jogo:', error);
      alert('Erro ao finalizar jogo. Por favor, tente novamente.');
    }
  };

  // Função auxiliar para calcular a pontuação total
  const calculateTotalPoints = (categories: { [key: string]: number }) => {
    return Object.values(categories).reduce((total, points) => total + (points || 0), 0);
  };

  const renderCategory = (category: string, label: string) => {
    if (!currentPlayer || !match) return null;
    
    // Busca o jogador mais atualizado do match
    const playerInMatch = match.players.find(p => p.id === currentPlayer.id);
    if (!playerInMatch) return null;

    // Usa as categorias do jogador atual
    const playerCategories = playerInMatch.categories || {};
    
    // Verifica se a categoria existe para este jogador
    const hasCategory = category in playerCategories;
    const points = playerCategories[category];
    const isCrossed = points === 0;
    const isScored = points !== undefined && points > 0;
    
    const categoryConfig = CATEGORY_CONFIGS[category];
    let className = 'category';
    
    if (isScored) {
      className += ' scored';
    } else if (isCrossed) {
      className += ' crossed';
    }

    const renderContent = () => {
      if (isScored) {
        return (
          <div className="scored-content">
            <h1>{String(points).padStart(2, '0')}</h1>
          </div>
        );
      } else if (isCrossed) {
        return (
          <>
            <h1>{categoryConfig.title}</h1>
            <p>{categoryConfig.description}</p>
            <div className="cross"></div>
          </>
        );
      }
      return (
        <>
          <h1>{categoryConfig.title}</h1>
          <p>{categoryConfig.description}</p>
        </>
      );
    };

    return (
      <div 
        className={className} 
        onClick={() => handleCategoryClick(category)}
        key={`${playerInMatch.id}-${category}-${points}-${hasCategory ? 1 : 0}`}
      >
        {renderContent()}
      </div>
    );
  };

  const handleDeleteClick = (e: React.MouseEvent, playerId: number) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calcula a posição do menu considerando o scroll da página
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setMenuPosition({
      x: rect.left + scrollLeft,
      y: rect.bottom + scrollTop
    });
    
    setPlayerToDeleteFromList(playerToDeleteFromList === playerId ? null : playerId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerToDeleteFromList !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.remove-confirmation') && !target.closest('.delete-button') && !target.closest('.remove-player-button')) {
          setPlayerToDeleteFromList(null);
          setMenuPosition(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [playerToDeleteFromList]);

  // Função para formatar o tempo decorrido
  const formatElapsedTime = (startTime: string): string => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const elapsed = Math.max(0, now - start);

    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Função para iniciar o timer
  const startTimer = (startTime: string) => {
    if (timer) {
      clearInterval(timer);
    }
    
    // Se o modal de fim de jogo estiver aberto, não inicia o timer
    if (showEndGameModal) {
      return;
    }
    
    // Atualiza imediatamente o tempo decorrido
    setElapsedTime(formatElapsedTime(startTime));
    
    // Configura o intervalo para atualizar a cada segundo
    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(startTime));
    }, 1000);
    
    setTimer(interval);
  };

  if (!match) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <h1>{match.name}</h1>
          <div className="match-info">
            <span className="rounds-count">
              Rodada Atual: {match.round || 1}
            </span>
            <span className="total-rounds">
              Total de Rodadas: {(match.round || 1) - 1}
            </span>
            <span className="elapsed-time">
              {elapsedTime}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="close" onClick={handleClose}>X</button>
        </div>
      </div>

      <div className="players">
        <div className="players-header">
          <h2>Jogadores</h2>
          <div className="players-actions">
            <div className="players-count">
              {match.players.length} jogador(es)
            </div>
            <button 
              className="add-player-button" 
              onClick={() => setShowAddPlayerModal(true)}
            >
              +
            </button>
          </div>
        </div>
        <div className="list">
          {match.players.map((player, index) => (
            <div
              key={`player-${player.id}-${index}`}
              className={`player ${player.id === currentPlayer?.id ? 'active' : ''}`}
            >
              <div 
                className="player-content"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayerClick(player);
                }}
              >
                <div className="player-avatar">{player.avatar || '👤'}</div>
                <div className="player-info">
                  <p>Gamer {index + 1}</p>
                  <span>{player.name || `Jogador ${index + 1}`}</span>
                </div>
                {match.players.length > 2 && (
                  <div className="remove-player-container">
                    <button 
                      className="remove-player-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(e, player.id);
                      }}
                      title="Remover jogador"
                    >
                      🗑️
                    </button>
                    {playerToDeleteFromList === player.id && menuPosition && (
                      <div 
                        className="remove-confirmation"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p>Remover {player.name} da partida?</p>
                        <div className="confirmation-buttons">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePlayer(player.id);
                            }}
                            className="confirm"
                          >
                            Sim
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayerToDeleteFromList(null);
                              setMenuPosition(null);
                            }}
                            className="cancel"
                          >
                            Não
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddPlayerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Adicionar Jogador</h3>
              <button onClick={() => {
                setShowAddPlayerModal(false);
                setShowPlayerForm(false);
                setPlayerFormData({ id: 0, name: '', avatar: '👤' });
                setIsEditing(false);
              }}>X</button>
            </div>
            <div className="modal-content">
              {!showPlayerForm ? (
                <>
                  <div className="modal-actions">
                    <button 
                      className="create-player-button"
                      onClick={() => {
                        setShowPlayerForm(true);
                        setIsEditing(false);
                        setPlayerFormData({ id: 0, name: '', avatar: '👤' });
                      }}
                    >
                      ➕ Criar Novo Jogador
                    </button>
                  </div>
                  {availablePlayers.length === 0 ? (
                    <p>Não há jogadores disponíveis para adicionar.</p>
                  ) : (
                    <div className="available-players-list">
                      {availablePlayers.map((player, index) => (
                        <div key={`available-${player.id}-${index}`} className="available-player">
                          <div className="player-content" onClick={() => handleAddPlayer(player)}>
                            <div className="player-avatar">{player.avatar}</div>
                            <div className="player-info">
                              <span>{player.name}</span>
                            </div>
                          </div>
                          <div className="player-actions">
                            <button 
                              className="edit-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPlayer(player);
                              }}
                            >
                              ✏️
                            </button>
                            <div className="remove-player-container">
                              <button 
                                className="delete-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayerToDeleteFromList(playerToDeleteFromList === player.id ? null : player.id);
                                }}
                              >
                                🗑️
                              </button>
                              {playerToDeleteFromList === player.id && (
                                <div className="remove-confirmation">
                                  <p>Excluir {player.name}?</p>
                                  <div className="confirmation-buttons">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlayer(player.id);
                                      }}
                                      className="confirm"
                                    >
                                      Sim
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPlayerToDeleteFromList(null);
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
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleCreateOrUpdatePlayer}>
                  <div className="form-group">
                    <label>Nome:</label>
                    <input
                      type="text"
                      value={playerFormData.name}
                      onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Avatar:</label>
                    <div className="avatar-grid">
                      {['👤', '👧', '👨', '👩', '👶', '👵', '👱', '👮', '👯', '👰'].map((avatar, index) => (
                        <div
                          key={`avatar-${avatar}-${index}`}
                          onClick={() => setPlayerFormData({ ...playerFormData, avatar })}
                          className={`avatar-option ${playerFormData.avatar === avatar ? 'selected' : ''}`}
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowPlayerForm(false);
                        setPlayerFormData({ id: 0, name: '', avatar: '👤' });
                        setIsEditing(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="save-button">
                      {isEditing ? 'Atualizar' : 'Salvar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="scoreboard">
        <h2>Marcador</h2>
        <div className="score">
          <div className="player-header">
            <div className="player-avatar">{currentPlayer?.avatar || '👤'}</div>
            <h3>{currentPlayer?.name || 'Selecione um jogador'}</h3>
          </div>
          <span>{currentPlayer?.points || 0}</span>
        </div>
        {currentPlayer ? (
          <div className="categories">
            {renderCategory('as', 'Ás')}
            {renderCategory('duque', 'Duque')}
            {renderCategory('terno', 'Terno')}
            {renderCategory('quadra', 'Quadra')}
            {renderCategory('quina', 'Quina')}
            {renderCategory('sena', 'Sena')}
            {renderCategory('full', 'Full')}
            {renderCategory('sequencia', 'Sequência')}
            {renderCategory('quadrada', 'Quadrada')}
            {renderCategory('general', 'General')}
          </div>
        ) : (
          <div className="no-player-message">
            <p>Clique em um jogador para ver o marcador</p>
          </div>
        )}
      </div>

      {showScoreModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
          <div className="score-modal" onClick={e => e.stopPropagation()}>
            <div className="header">
              <h1>{CATEGORY_CONFIGS[selectedCategory].title}</h1>
              <p>{CATEGORY_CONFIGS[selectedCategory].description}</p>
              <div className="delete-icon" onClick={() => handleScoreSelect(0, true)} title="Deletar pontuação">🗑️</div>
            </div>
            <div className="grid">
              {CATEGORY_CONFIGS[selectedCategory].options.map((option, index) => (
                <div key={`score-option-${selectedCategory}-${index}`} onClick={() => handleScoreSelect(option.points)}>
                  <h2>{option.hidePoints ? option.label : option.points}</h2>
                  <p>{option.hidePoints ? 'Vitória automática' : option.label}</p>
                </div>
              ))}
              <div onClick={() => handleScoreSelect(0)}>
                <h2 className="risked">RISCAR</h2>
                <p>Nenhum ponto</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEndGameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Fim de Jogo</h3>
            </div>
            <div className="modal-content">
              {match && (
                <div className="ranking-container">
                  <h2>Ranking</h2>
                  {[...match.players]
                    .sort((a, b) => (b.points || 0) - (a.points || 0))
                    .map((player, index) => (
                      <div 
                        key={player.id} 
                        className={`ranking-item ${index === 0 ? 'winner' : ''}`}
                      >
                        <div className="position">#{index + 1}</div>
                        <div className="player-info">
                          <div className="player-avatar">{player.avatar}</div>
                          <div className="player-details">
                            <span className="player-name">{player.name}</span>
                            <div className="player-match-stats">
                              <div className="stat">
                                <span className="stat-label">Pontuação</span>
                                <span className="stat-value highlight">
                                  {player.points || 0}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Riscos</span>
                                <span className="stat-value">
                                  {Object.values(player.categories || {}).filter(points => points === 0).length}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Generals</span>
                                <span className="stat-value">
                                  {Object.entries(player.categories || {})
                                    .filter(([category, points]) => category === 'general' && points === 40).length}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">G. de Boca</span>
                                <span className="stat-value">
                                  {Object.entries(player.categories || {})
                                    .filter(([category, points]) => category === 'general' && points === 1000).length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index === 0 && <div className="winner-crown">👑</div>}
                      </div>
                    ))}
                </div>
              )}
              <div className="end-game-options">
                <button onClick={handleContinueGame}>
                  Continuar Jogando
                </button>
                <button onClick={handleNewGame}>
                  Jogar Novamente
                </button>
                <button onClick={() => handleEndGame(true)}>
                  Finalizar Jogo
                </button>
                <button onClick={handleClose} className="play-later">
                  Jogar Depois
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marker; 
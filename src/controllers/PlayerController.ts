import { Request, Response } from 'express';
import Player from '../models/Player';
import { QueryTypes } from 'sequelize';

class PlayerController {
  index = async (req: Request, res: Response) => {
    try {
      const players = await Player.findAll({
        order: [['id', 'ASC']]
      });
      return res.json(players);
    } catch (error) {
      console.error('Erro ao listar jogadores:', error);
      return res.status(400).json({ error: 'Erro ao listar jogadores' });
    }
  }

  store = async (req: Request, res: Response) => {
    try {
      const { name, avatar, points = 0, victories = 0, rounds = 0, general = 0, riscos = 0 } = req.body;
      
      if (!name || !avatar) {
        return res.status(400).json({ error: 'Nome e avatar são obrigatórios' });
      }

      // Busca o último ID para garantir a sequência correta
      const lastPlayer = await Player.findOne({
        order: [['id', 'DESC']]
      });

      const nextId = lastPlayer ? lastPlayer.id + 1 : 1;

      const player = await Player.create({ 
        id: nextId,
        name, 
        avatar, 
        points,
        victories,
        rounds,
        general,
        riscos
      });
      
      return res.status(201).json(player);
    } catch (error) {
      console.error('Erro ao criar jogador:', error);
      return res.status(400).json({ error: 'Erro ao criar jogador' });
    }
  }

  show = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const player = await Player.findByPk(id);
      
      if (!player) {
        return res.status(404).json({ error: 'Jogador não encontrado' });
      }

      return res.json(player);
    } catch (error) {
      console.error('Erro ao buscar jogador:', error);
      return res.status(400).json({ error: 'Erro ao buscar jogador' });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, avatar, points, victories, rounds, generalBoca, general, riscos } = req.body;
      
      const player = await Player.findByPk(id);
      
      if (!player) {
        return res.status(404).json({ error: 'Jogador não encontrado' });
      }

      if (!name || !avatar) {
        return res.status(400).json({ error: 'Nome e avatar são obrigatórios' });
      }

      await player.update({ 
        name, 
        avatar,
        points: points || 0,
        victories: victories || 0,
        rounds: rounds || 0,
        generalBoca: generalBoca || 0,
        general: general || 0,
        riscos: riscos || 0
      });

      return res.json(player);
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      return res.status(400).json({ error: 'Erro ao atualizar jogador' });
    }
  }

  destroy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const player = await Player.findByPk(id);
      
      if (!player) {
        return res.status(404).json({ error: 'Jogador não encontrado' });
      }

      await player.destroy();
      
      // Busca todos os jogadores restantes ordenados por ID
      const remainingPlayers = await Player.findAll({
        order: [['id', 'ASC']]
      });

      // Se ainda houver jogadores, reordena os IDs
      if (remainingPlayers.length > 0) {
        // Atualiza os IDs sequencialmente
        for (let i = 0; i < remainingPlayers.length; i++) {
          const newId = i + 1;
          if (remainingPlayers[i].id !== newId) {
            await remainingPlayers[i].update({ id: newId });
          }
        }

        // Atualiza a sequência para o próximo ID disponível
        await Player.sequelize?.query(
          `SELECT setval(pg_get_serial_sequence('players', 'id'), ${remainingPlayers.length}, true)`,
          { type: QueryTypes.RAW }
        );
      } else {
        // Se não houver mais jogadores, reseta a sequência
        await Player.sequelize?.query(
          `SELECT setval(pg_get_serial_sequence('players', 'id'), 1, false)`,
          { type: QueryTypes.RAW }
        );
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
      return res.status(500).json({ error: 'Erro ao excluir jogador' });
    }
  }

  private reorderIds = async () => {
    try {
      const players = await Player.findAll({
        order: [['id', 'ASC']]
      });

      // Atualiza os IDs sequencialmente
      for (let i = 0; i < players.length; i++) {
        const newId = i + 1;
        if (players[i].id !== newId) {
          await players[i].update({ id: newId });
        }
      }

      // Atualiza a sequência para o próximo ID disponível
      await Player.sequelize?.query(
        `SELECT setval(pg_get_serial_sequence('players', 'id'), ${players.length}, true)`,
        { type: QueryTypes.RAW }
      );
    } catch (error) {
      console.error('Erro ao reordenar IDs:', error);
      throw error;
    }
  }
}

export default new PlayerController(); 
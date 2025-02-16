import { Request, Response } from 'express';
import Match from '../models/Match';

class MatchController {
  async index(req: Request, res: Response) {
    try {
      const matches = await Match.findAll({
        order: [['createdAt', 'DESC']]
      });
      return res.json(matches);
    } catch (error) {
      console.error('Erro ao listar partidas:', error);
      return res.status(500).json({ error: 'Erro ao listar partidas' });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { name, date, status, players, folderId = 1 } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const match = await Match.create({ 
        name, 
        date: date || new Date(), 
        status: status || 'pending',
        folderId,
        players: players || [],
        round: 1,
      });
      
      return res.status(201).json(match);
    } catch (error) {
      console.error('Erro ao criar partida:', error);
      return res.status(500).json({ error: 'Erro ao criar partida' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await Match.findByPk(id);
      
      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' });
      }

      return res.json(match);
    } catch (error) {
      console.error('Erro ao buscar partida:', error);
      return res.status(500).json({ error: 'Erro ao buscar partida' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, date, status, players, currentPlayer, round, winner, startTime } = req.body;
      
      const match = await Match.findByPk(id);
      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' });
      }

      await match.update({
        name,
        date,
        status,
        players,
        currentPlayer,
        round,
        winner,
        startTime
      });

      return res.json(match);
    } catch (error) {
      console.error('Erro ao atualizar partida:', error);
      return res.status(500).json({ error: 'Erro ao atualizar partida' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const match = await Match.findByPk(id);
      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' });
      }

      await match.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir partida:', error);
      return res.status(500).json({ error: 'Erro ao excluir partida' });
    }
  }
}

export default new MatchController(); 
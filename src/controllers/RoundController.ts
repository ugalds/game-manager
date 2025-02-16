import { Request, Response } from 'express';
import Round from '../models/Round';

class RoundController {
  async index(req: Request, res: Response) {
    try {
      const rounds = await Round.findAll();
      return res.json(rounds);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao listar rodadas' });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { number, matchId, status } = req.body;
      const round = await Round.create({ number, matchId, status });
      return res.status(201).json(round);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar rodada' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const round = await Round.findByPk(id);
      
      if (!round) {
        return res.status(404).json({ error: 'Rodada não encontrada' });
      }

      return res.json(round);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar rodada' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { number, matchId, status } = req.body;
      
      const round = await Round.findByPk(id);
      if (!round) {
        return res.status(404).json({ error: 'Rodada não encontrada' });
      }

      await round.update({ number, matchId, status });
      return res.json(round);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar rodada' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const round = await Round.findByPk(id);
      
      if (!round) {
        return res.status(404).json({ error: 'Rodada não encontrada' });
      }

      await round.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir rodada' });
    }
  }
}

export default new RoundController(); 
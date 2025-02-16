import { Request, Response } from 'express';
import Folder from '../models/Folder';

class FolderController {
  async index(req: Request, res: Response) {
    try {
      const folders = await Folder.findAll();
      return res.json(folders);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar pastas' });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { name, parentId } = req.body;
      const folder = await Folder.create({ name, parentId });
      return res.status(201).json(folder);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar pasta' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const folder = await Folder.findByPk(id);
      if (!folder) {
        return res.status(404).json({ error: 'Pasta não encontrada' });
      }

      return res.json(folder);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pasta' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, parentId } = req.body;
      
      const folder = await Folder.findByPk(id);
      if (!folder) {
        return res.status(404).json({ error: 'Pasta não encontrada' });
      }

      await folder.update({ name, parentId });
      return res.json(folder);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar pasta' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const folder = await Folder.findByPk(id);
      if (!folder) {
        return res.status(404).json({ error: 'Pasta não encontrada' });
      }

      await folder.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar pasta' });
    }
  }
}

export default new FolderController(); 
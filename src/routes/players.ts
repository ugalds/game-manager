import { Router } from 'express';
import PlayerController from '../controllers/PlayerController';

const router = Router();

console.log('Registrando rotas de players...');

router.get('/', (req, res, next) => {
  console.log('Rota GET /players acessada');
  PlayerController.index(req, res);
});

router.post('/', (req, res, next) => {
  console.log('Rota POST /players acessada');
  PlayerController.store(req, res);
});

router.get('/:id', (req, res, next) => {
  console.log('Rota GET /players/:id acessada');
  PlayerController.show(req, res);
});

router.put('/:id', (req, res, next) => {
  console.log('Rota PUT /players/:id acessada');
  PlayerController.update(req, res);
});

router.delete('/:id', (req, res, next) => {
  console.log('Rota DELETE /players/:id acessada');
  PlayerController.destroy(req, res);
});

console.log('Rotas de players registradas com sucesso');

export default router; 
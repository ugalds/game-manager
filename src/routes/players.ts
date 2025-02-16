import { Router } from 'express';
import PlayerController from '../controllers/PlayerController';

const router = Router();

router.get('/', PlayerController.index);
router.post('/', PlayerController.store);
router.get('/:id', PlayerController.show);
router.put('/:id', PlayerController.update);
router.delete('/:id', PlayerController.destroy);

export default router; 
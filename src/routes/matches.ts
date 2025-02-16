import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const router = Router();

router.get('/', MatchController.index);
router.post('/', MatchController.store);
router.get('/:id', MatchController.show);
router.put('/:id', MatchController.update);
router.delete('/:id', MatchController.destroy);

export default router; 
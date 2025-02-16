import { Router } from 'express';
import playerRoutes from './players';
import matchRoutes from './matches';

const router = Router();

// Rotas para Players
router.use('/players', playerRoutes);

// Rotas para Matches
router.use('/matches', matchRoutes);

export default router; 
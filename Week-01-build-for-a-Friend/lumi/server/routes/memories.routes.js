import { Router } from 'express';
import { getMemories } from '../controllers/memories.controller.js';

const router = Router();

router.get('/', getMemories);

export default router;

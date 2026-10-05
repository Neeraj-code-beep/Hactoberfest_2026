import { Router } from 'express';
import { askLumi } from '../controllers/ask.controller.js';

const router = Router();

router.post('/', askLumi);

export default router;

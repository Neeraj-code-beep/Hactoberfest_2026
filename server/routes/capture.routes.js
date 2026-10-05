import { Router } from 'express';
import { captureThought } from '../controllers/capture.controller.js';

const router = Router();

router.post('/', captureThought);

export default router;

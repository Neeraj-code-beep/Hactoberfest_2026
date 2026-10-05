import { Router } from 'express';
import { getTellLaterItems, completeTellLaterItem } from '../controllers/tellLater.controller.js';

const router = Router();

router.get('/', getTellLaterItems);
router.patch('/:id/complete', completeTellLaterItem);

export default router;

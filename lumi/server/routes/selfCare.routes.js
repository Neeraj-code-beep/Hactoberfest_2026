import { Router } from 'express';
import { getSelfCare, updateSelfCare } from '../controllers/selfCare.controller.js';

const router = Router();

router.get('/', getSelfCare);
router.post('/', updateSelfCare);

export default router;

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import captureRoutes from './capture.routes.js';
import tellLaterRoutes from './tellLater.routes.js';
import memoriesRoutes from './memories.routes.js';
import selfCareRoutes from './selfCare.routes.js';
import askRoutes from './ask.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/capture', captureRoutes);
apiRouter.use('/tell-later', tellLaterRoutes);
apiRouter.use('/memories', memoriesRoutes);
apiRouter.use('/self-care', selfCareRoutes);
apiRouter.use('/ask', askRoutes);

export default apiRouter;

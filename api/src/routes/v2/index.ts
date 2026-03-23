import { Router } from 'express';

import feedbackRoutes from './feedback';
import reportRoutes from './report-status';
import subscriptionRoutes from './subscription';

const router = Router();

router.use('/', feedbackRoutes);
router.use('/', reportRoutes);
router.use('/', subscriptionRoutes);

export default router;

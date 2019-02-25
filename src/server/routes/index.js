import { Router } from 'express';
import contactRouter from './gmail';
import userRouter from './user';
import stripeDonationsRouter from './stripePay';
import dotenv from 'dotenv';
dotenv.config();

let router = Router();

router.use('/charge', stripeDonationsRouter);
router.use('/contact', contactRouter);
router.use('/members', userRouter);

export default router;
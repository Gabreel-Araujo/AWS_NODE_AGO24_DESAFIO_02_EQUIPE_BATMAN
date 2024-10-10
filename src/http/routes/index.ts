import { Router } from 'express';
import customersRouter from '@/modules/customers/routes/customers.routes';
import authRoutes from '../../modules/users/routes/auth.routes';
import userRoutes from '../../modules/users/routes/user.routes';

const routes = Router();
const path = '/api/v1';

routes.use('/api/v1', authRoutes);
routes.use(`${path}/users`, userRoutes);
routes.use(`${path}/customers`, customersRouter);
// routes.use('/cars');
// routes.use('/rental-order');

export default routes;

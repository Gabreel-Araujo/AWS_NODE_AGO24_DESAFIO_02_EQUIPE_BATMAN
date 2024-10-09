import { Router } from 'express';
import authRoutes from '../../modules/users/routes/auth.route';
import userRoutes from '../../modules/users/routes/user.route';

const routes = Router();

// Adicionar arquivo de rotas posteriormente
routes.use('/api/v1', authRoutes);
routes.use('/api/v1', userRoutes);
// routes.use('/customers');
// routes.use('/cars');
// routes.use('/rental-order');

export default routes;

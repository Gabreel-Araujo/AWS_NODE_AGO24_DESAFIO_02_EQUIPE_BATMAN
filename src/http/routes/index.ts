import { Router } from 'express';
import customersRouter from '@/modules/customers/routes/customers.routes';

const routes = Router();

// Adicionar arquivo de rotas posteriormente
// routes.use('/auth');
// routes.use('/users');
routes.use('/customers', customersRouter);
// routes.use('/cars');
// routes.use('/rental-order');

export default routes;

import carsRouter from '@/modules/cars/routes/cars.routes';
import customersRouter from '@/modules/customers/routes/customers.routes';
import { Router } from 'express';
import rentalOrderRouter from '../../modules/rentalOrder/routes/rentalOrders.routes';
import authRoutes from '../../modules/users/routes/auth.routes';
import userRoutes from '../../modules/users/routes/user.routes';

const routes = Router();
const path = '/api/v1';

routes.use('/api/v1', authRoutes);
routes.use(`${path}/users`, userRoutes);
routes.use(`${path}/customers`, customersRouter);
routes.use(`${path}/cars`, carsRouter);
routes.use(`${path}/rental-order`, rentalOrderRouter);

export default routes;

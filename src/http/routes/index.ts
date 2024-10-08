import { Router } from 'express';
import userRoutes from "../../modules/users/typeorm/routes/UserRoutes"

const routes = Router();

// Adicionar arquivo de rotas posteriormente
// routes.use('/auth');
routes.use(userRoutes);
// routes.use('/customers');
// routes.use('/cars');
// routes.use('/rental-order');

export default routes;

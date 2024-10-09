import { Router } from "express";
import userRoutes from "../../modules/users/typeorm/routes/UserRoutes";
import authRoutes from "../../modules/authentication/routes/AuthRoutes";

const routes = Router();

// Adicionar arquivo de rotas posteriormente
routes.use("/api/v1", authRoutes);
routes.use("/api/v1", userRoutes);
// routes.use('/customers');
// routes.use('/cars');
// routes.use('/rental-order');

export default routes;

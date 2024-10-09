import { Router } from 'express';
import CustomersController from '../controllers/CustomersController';
const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.get('/');
customersRouter.get('/:id', customersController.getById);
customersRouter.post('/');
customersRouter.put('/:id');
customersRouter.delete('/:id');

export default customersRouter;

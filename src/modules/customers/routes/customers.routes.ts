import { Router } from 'express';

const customersRouter = Router();

customersRouter.get('/');
customersRouter.get('/:id');
customersRouter.post('/');
customersRouter.put('/:id');
customersRouter.delete('/:id');

export default customersRouter;

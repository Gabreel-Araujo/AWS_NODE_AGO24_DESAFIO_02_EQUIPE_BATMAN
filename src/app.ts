import cors from 'cors';
import express from 'express';
import routes from './http/routes';
import errorMiddleware from './http/middleware/error';
import CreateDefaultUser from './modules/users/typeorm/seed/CreateDefaultUser';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorMiddleware);

import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import routes from './http/routes';
import errorMiddleware from './http/middleware/error';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

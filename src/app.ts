import cors from 'cors';
import express from 'express';
import errorMiddleware from './http/middleware/error';
import routes from './http/routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorMiddleware);

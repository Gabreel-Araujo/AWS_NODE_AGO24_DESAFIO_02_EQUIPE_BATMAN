import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import errorMiddleware from './http/middleware/error';
import routes from './http/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

app.use(errorMiddleware);

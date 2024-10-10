import cors from "cors";
import express from "express";
import routes from "./http/routes";
import errorMiddleware from "./http/middleware/error";
import { pagination } from "typeorm-pagination";
import * as bodyParser from "body-parser";
export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pagination);

app.use(routes);

app.use(errorMiddleware);

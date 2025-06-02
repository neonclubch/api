//import * as ff from "@google-cloud/functions-framework";
import express, { NextFunction, Request, Response } from "express";
import logger from "pino-http";
import cors from "cors";
import { json } from "body-parser";
import { getEvents } from "./pretixApi";

const app = express();

app.use(logger());
app.use(cors({ origin: "https://neonclub.ch" }));
app.use(json());
app.get("/events", getEventsRoute);
app.use(errorHandler);

export const eventApi = app;

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).send({ errors: [{ message: "Something went wrong", err }] });
  res.end();
}

async function getEventsRoute(req: Request, res: Response) {
  const pretixReq = await getEvents(req.query);
  res.json(pretixReq.data);
}

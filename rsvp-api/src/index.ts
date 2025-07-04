//import * as ff from "@google-cloud/functions-framework";
import express, { NextFunction, Request, Response } from "express";
import logger from "pino-http";
import cors from "cors";
import { json } from "body-parser";
import { getRsvp } from "./rsvpApi";


const app = express();

app.use(logger());
app.use(cors({ origin: "https://neonclub.ch" }));
app.use(json());
app.get("/rsvp/:id", getRsvpRoute);
app.use(errorHandler);

export const rsvpApi = app;

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).send({ errors: [{ message: "Something went wrong", err }] });
  res.end();
}

async function getRsvpRoute(req: Request, res: Response) {
  const rsvp = await getRsvp(req.params.id);
  if (!rsvp) {
    res.status(404).send({ errors: [{ message: "RSVP not found" }] });
    return;
  }
  res.json(rsvp);
}


import { RequestHandler } from "express";

export interface Route {
  path: string;
  method: "get" | "post" | "patch" | "put" | "delete";
  handler: RequestHandler[];
}

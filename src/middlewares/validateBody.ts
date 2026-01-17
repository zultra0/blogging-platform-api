import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject } from "zod";

// This is a factory function, it must have req, res and next object as parameters.
// Otherwise, Express won't consider it as a valid middleware.
export const validateBody = (schema: ZodObject): RequestHandler => {
  return (req: Request<{ id?: number }>, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};

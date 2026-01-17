import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// This is a factory function, it must have req, res and next object as parameters.
// Otherwise, Express won't consider it as a valid middleware.
export const validateBody = (schema: z.ZodObject) => {
  return (req: Request<{ id?: number }>, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};

import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject } from "zod";

export const validateBody = (
  schema: ZodObject,
): RequestHandler<{ id: number }> => {
  return (req: Request<{ id?: number }>, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};

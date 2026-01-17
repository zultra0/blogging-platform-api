import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// This is a factory function, it must have req, res and next object as parameters.
// Otherwise, Express won't consider it as a valid middleware.
export const validateBody = (schema: z.ZodObject) => {
  return (req: Request<{ id?: number }>, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return res
          .status(400)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};

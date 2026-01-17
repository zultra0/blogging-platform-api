import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ status: 400, message });
  } else if (err instanceof ZodError) {
    const errorMessages = err.issues.map((issue: any) => ({
      message: `${issue.path.join(".")} is ${issue.message}`,
    }));
    return res
      .status(400)
      .json({ error: "Invalid data", details: errorMessages });
  } else {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

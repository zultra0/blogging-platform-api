import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    res.status(400).json({ status: 400, message });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

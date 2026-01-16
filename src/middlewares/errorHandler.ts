import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/types.js";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ status: 400, message });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

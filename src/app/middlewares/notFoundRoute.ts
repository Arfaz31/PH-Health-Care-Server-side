import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      messsage: "Your requested path is not found",
    },
  });
};

export default notFoundRoute;

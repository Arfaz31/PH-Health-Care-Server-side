import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import AppError from "../errors/AppError";
import { jwtHelpers } from "../../helpers/jwtHelper";
import { config } from "../config";
import { Secret } from "jsonwebtoken";
import prisma from "../../shared/prisma";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt_access_secret as Secret
    );
    const { email } = verifiedUser;
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    if (userData.status === "DELETED" || userData.status === "Blocked") {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = verifiedUser;

    if (roles.length && !roles.includes(verifiedUser.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
    }
    next();
  });
};

export default auth;

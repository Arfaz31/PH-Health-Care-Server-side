import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { config } from "../../config";
import { Secret } from "jsonwebtoken";

const login = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.Active,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_access_secret as Secret,
    config.jwt_access_expire_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expire_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt_refresh_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.Active,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_access_secret as Secret,
    config.jwt_access_expire_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthService = {
  login,
  refreshToken,
};

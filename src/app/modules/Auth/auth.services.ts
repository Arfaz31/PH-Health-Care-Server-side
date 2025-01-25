/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { config } from "../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

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
    console.log(err);
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

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.Active,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.Active,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.reset_pass_secret as Secret,
    config.reset_pass_expire_in as string
  );
  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
  await emailSender(
    userData.email,
    `
    <div>
        <p>Dear User,</p>
        <p>Your password reset link 
            <a href=${resetPassLink}>
                <button>
                    Reset Password
                </button>
            </a>
        </p>

    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log({ token, payload });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.Active,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const hashPassword = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const AuthService = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};

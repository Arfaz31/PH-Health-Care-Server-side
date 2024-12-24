import { Admin, Doctor, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { TImageFile } from "../../Interfaces/image.interface";

const createAdmin = async (
  password: string,
  payload: Admin,
  profilePhoto: TImageFile
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    email: payload.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  if (profilePhoto) {
    payload.profilePhoto = profilePhoto.path;
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createAdminData = await transactionClient.admin.create({
      data: payload,
    });
    return createAdminData;
  });

  return result;
};

const createDoctor = async (
  password: string,
  payload: Doctor,
  profilePhoto: TImageFile
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    email: payload.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  if (profilePhoto) {
    payload.profilePhoto = profilePhoto.path;
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createDoctorData = await transactionClient.doctor.create({
      data: payload,
    });
    return createDoctorData;
  });

  return result;
};
export const userService = {
  createAdmin,
  createDoctor,
};

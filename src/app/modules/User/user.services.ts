import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { TImageFile } from "../../Interfaces/image.interface";
import { IPaginationOptions } from "../../Interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { userSearchAbleFields } from "./user.constant";

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

const createPatient = async (
  password: string,
  payload: Patient,
  profilePhoto: TImageFile
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    email: payload.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  if (profilePhoto) {
    payload.profilePhoto = profilePhoto.path;
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createPatientData = await transactionClient.patient.create({
      data: payload,
    });
    return createPatientData;
  });

  return result;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditons: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditons.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
            // will dynamically create a new object where:
            //     The key is "name" (value of options.sortBy).
            //     The value is "asc" (value of options.sortOrder).
            // {
            //   name: "asc"
            // }
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDB,
};

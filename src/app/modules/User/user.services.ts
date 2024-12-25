import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { TImageFile } from "../../Interfaces/image.interface";
import { IPaginationOptions } from "../../Interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../Interfaces/common";

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
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
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

const changeProfileStatus = async (id: string, status: UserRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.Active,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        id: userInfo.id,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        id: userInfo.id,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (
  email: string,
  payload: any,
  profilePhoto?: TImageFile
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: UserStatus.Active,
    },
  });

  if (profilePhoto) {
    payload.profilePhoto = profilePhoto.path;
  }

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  }

  return { ...profileInfo };
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};

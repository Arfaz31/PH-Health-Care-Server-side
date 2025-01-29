/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./Admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./Admin.interface";
import { IPaginationOptions } from "../../Interfaces/pagination";

const getAllFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditons: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditons.push({
      OR: adminSearchAbleFields.map((field) => ({
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

  andConditons.push({
    isDeleted: false,
  });

  //console.dir(andCondions, { depth: 'inifinity' })
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditons };
  const result = await prisma.admin.findMany({
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

  const total = await prisma.admin.count({
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

const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!result) {
    throw new Error("user not found");
  }
  return result;
};

const updateAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeleteData.email,
      },
    });
    return adminDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeleteData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeleteData;
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
  getAdminById,
  updateAdminIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

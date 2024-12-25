import { Specialities } from "@prisma/client";
import { TImageFile } from "../../Interfaces/image.interface";
import prisma from "../../../shared/prisma";

const createSpecialist = async (payload: Specialities, icon: TImageFile) => {
  if (icon) {
    payload.icon = icon.path;
  }
  const result = await prisma.specialities.create({ data: payload });
  return result;
};

const getAllFromDB = async (): Promise<Specialities[]> => {
  return await prisma.specialities.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialities> => {
  const result = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return result;
};
export const SpecialitiesService = {
  createSpecialist,
  getAllFromDB,
  deleteFromDB,
};

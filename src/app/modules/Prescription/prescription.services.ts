import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../Interfaces/common";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const insertIntoDB = async (
  user: IAuthUser,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (!(user?.email === appointmentData.doctor.email)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This is not your appointment!"
    );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null || undefined,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

export const PrescriptionService = {
  insertIntoDB,
  // patientPrescription,
  // getAllFromDB
};

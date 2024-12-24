import { Request, Response } from "express";
import { userService } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/SendResponse";
import { userFilterableFields } from "./user.constant";

const createAdmin = async (req: Request, res: Response) => {
  const { password, admin: AdminData } = req.body;

  // Define the type for files inline
  const files = req.files as any;

  // Extract single files from the fields
  const profilePhoto = files?.profilePhoto ? files.profilePhoto[0] : undefined;
  try {
    const result = await userService.createAdmin(
      password,
      AdminData,
      profilePhoto
    );
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to create admin",
      error: error,
    });
  }
};

const createDoctor = async (req: Request, res: Response) => {
  const { password, doctor: DoctorData } = req.body;
  // console.log(req.body, req.files);

  // Define the type for files inline
  const files = req.files as any;

  // Extract single files from the fields
  const profilePhoto = files?.profilePhoto ? files.profilePhoto[0] : undefined;
  try {
    const result = await userService.createDoctor(
      password,
      DoctorData,
      profilePhoto
    );
    res.status(200).json({
      success: true,
      message: "Doctor is created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to create doctor",
      error: error,
    });
  }
};

const createPatient = async (req: Request, res: Response) => {
  const { password, patient: PatientData } = req.body;
  // console.log(req.body, req.files);

  // Define the type for files inline
  const files = req.files as any;

  // Extract single files from the fields
  const profilePhoto = files?.profilePhoto ? files.profilePhoto[0] : undefined;
  try {
    const result = await userService.createPatient(
      password,
      PatientData,
      profilePhoto
    );
    res.status(200).json({
      success: true,
      message: "Patient is created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to create patient",
      error: error,
    });
  }
};

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getAllUserFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users are fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
};

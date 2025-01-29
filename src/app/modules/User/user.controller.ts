/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { userService } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/SendResponse";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../Interfaces/common";

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

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await userService.getMyProfile(user as IAuthUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  // Define the type for files inline
  const files = req.files as any;
  const { email } = req.user;
  // Extract single files from the fields
  const profilePhoto = files?.profilePhoto ? files.profilePhoto[0] : undefined;
  const result = await userService.updateMyProfile(
    email,
    req.body,
    profilePhoto
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "user profile is updated successfully",
    data: result,
  });
});
export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};

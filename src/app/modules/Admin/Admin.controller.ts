/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AdminService } from "./Admin.services";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./Admin.constant";
import sendResponse from "../../../shared/SendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getAdminById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully",
    data: result,
  });
});

const updateAdminData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.updateAdminIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to delete admin",
      error: error,
    });
  }
};

const softDeleteAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to delete admin",
      error: error,
    });
  }
};

export const AdminController = {
  getAllFromDB,
  getSingleAdmin,
  updateAdminData,
  deleteAdminData,
  softDeleteAdminData,
};

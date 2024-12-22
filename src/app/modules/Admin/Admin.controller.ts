import { Request, Response } from "express";
import { AdminService } from "./Admin.services";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./Admin.constant";
import sendResponse from "../../../shared/SendResponse";
import { StatusCodes } from "http-status-codes";
const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log("options", options);
    const result = await AdminService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to get all admin",
      error: error,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getAdminById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to get admin",
      error: error,
    });
  }
};

const updateAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.updateAdminIntoDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin Update successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.name || "Failed to update admin",
      error: error,
    });
  }
};

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

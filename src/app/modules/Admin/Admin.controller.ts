import { Request, Response } from "express";
import { AdminService } from "./Admin.services";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./Admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log("options", options);
    const result = await AdminService.getAllFromDB(filters, options);
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
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
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
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

export const AdminController = {
  getAllFromDB,
  getSingleAdmin,
};

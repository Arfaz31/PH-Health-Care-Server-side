import { Request, Response } from "express";
import { userService } from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
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

export const userController = {
  createAdmin,
};

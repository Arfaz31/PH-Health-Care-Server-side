import { Request, Response } from "express";
import { userService } from "./user.services";

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

export const userController = {
  createAdmin,
};

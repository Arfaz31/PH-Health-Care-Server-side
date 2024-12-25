import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { StatusCodes } from "http-status-codes";
import { SpecialitiesService } from "./specialities.services";

const inserSpecialistIntoDB = catchAsync(async (req, res) => {
  const files = req.files as any;
  const icon = files?.icon ? files.icon[0] : undefined;
  const result = await SpecialitiesService.createSpecialist(req.body, icon);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await SpecialitiesService.getAllFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialitiesService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});
export const SpecialitiesController = {
  inserSpecialistIntoDB,
  getAllFromDB,
  deleteFromDB,
};

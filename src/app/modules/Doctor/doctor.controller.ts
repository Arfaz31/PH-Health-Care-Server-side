import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/SendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.services";
import { StatusCodes } from "http-status-codes";
const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await DoctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  getByIdFromDB,
};

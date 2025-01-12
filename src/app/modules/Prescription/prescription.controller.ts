import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { PrescriptionService } from "./prescription.services";
import pick from "../../../shared/pick";
import { prescriptionFilterableFields } from "./prescription.constant";

const insertIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await PrescriptionService.insertIntoDB(user as any, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

const patientPrescription = catchAsync(async (req, res) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.patientPrescription(
    user as any,
    options
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Prescription fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
export const PrescriptionController = {
  insertIntoDB,
  patientPrescription,
  getAllFromDB,
};

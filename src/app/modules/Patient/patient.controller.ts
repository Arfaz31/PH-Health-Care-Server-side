import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/SendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.services";
import { StatusCodes } from "http-status-codes";
const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

//   const updateIntoDB = catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const result = await PatientService.updateDoctorIntoDB(id, req.body);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Doctor data updated!",
//       data: result,
//     });
//   });

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};

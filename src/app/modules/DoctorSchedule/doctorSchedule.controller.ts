import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/SendResponse";
import { scheduleFilterableFields } from "./doctorSchedule.constant";
import { DoctorScheduleService } from "./doctorSchedule.services";
import { StatusCodes } from "http-status-codes";
const insertIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor Schedule created successfully!",
    data: result,
  });
});

const getMySchedule = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const user = req.user;
  const result = await DoctorScheduleService.getMySchedule(
    filters,
    options,
    user
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My Schedule fetched successfully!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await DoctorScheduleService.deleteFromDB(user, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My Schedule deleted successfully!",
    data: result,
  });
});

// const getAllFromDB = catchAsync(async (req, res) => {
//   const filters = pick(req.query, scheduleFilterableFields);
//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   const result = await DoctorScheduleService.getAllFromDB(filters, options);
//   sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Doctor Schedule retrieval successfully',
//       meta: result.meta,
//       data: result.data,
//   });
// });
export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedule,
  deleteFromDB,
};

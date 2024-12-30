import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
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

export const DoctorScheduleController = {
  insertIntoDB,
};

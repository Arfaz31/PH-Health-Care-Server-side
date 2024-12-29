import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { ScheduleService } from "./schedule.services";
import { StatusCodes } from "http-status-codes";
const inserIntoDB = catchAsync(async (req, res) => {
  const result = await ScheduleService.inserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

export const ScheduleController = {
  inserIntoDB,
};

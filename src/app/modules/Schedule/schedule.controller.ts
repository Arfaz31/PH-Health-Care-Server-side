import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
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

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const user = req.user;
  const result = await ScheduleService.getAllFromDB(filters, options, user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule fetched successfully!",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule retrieval successfully",
    data: result,
  });
});

export const ScheduleController = {
  inserIntoDB,
  getAllFromDB,
  getByIdFromDB,
};

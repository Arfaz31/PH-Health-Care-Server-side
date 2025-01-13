import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { MetaService } from "./meta.services";

const fetchDashboardMetaData = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await MetaService.fetchDashboardMetaData(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meta data retrival successfully!",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
};

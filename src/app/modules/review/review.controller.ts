import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { ReviewService } from "./review.services";

const insertIntoDB = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ReviewService.insertIntoDB(user as any, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const ReviewController = {
  insertIntoDB,
  // getAllFromDB
};

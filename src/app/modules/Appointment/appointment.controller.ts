import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/SendResponse";
import { AppointmentService } from "./appointment.services";
import { StatusCodes } from "http-status-codes";
const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await AppointmentService.createAppointment(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment booked successfully!",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  // getMyAppointment,
  // getAllFromDB,
  // changeAppointmentStatus
};

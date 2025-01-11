import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/SendResponse";
import { appointmentFilterableFields } from "./apointment.constant";
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

const getMyAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AppointmentService.getMyAppointment(
    user,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My Appointment retrive successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
const changeAppointmentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  const result = await AppointmentService.changeAppointmentStatus(
    id,
    status,
    user
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Appointment status changed successfully",
    data: result,
  });
});
export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllFromDB,
  changeAppointmentStatus,
};

import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { AppointmentService } from "./app/modules/Appointment/appointment.services";

const app: Application = express();
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//This middleware is used to parse URL-encoded data (e.g., Content-Type: application/x-www-form-urlencoded). Typically used for handling form submissions where data is sent in a query //string-like format: name=John+Doe&age=30
//The parsed data will be available as req.body.

app.use(cors());
app.use(cookieParser());

cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);
app.use(notFoundRoute);
export default app;

import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

// task 3
router.get("/", DoctorController.getAllFromDB);

export const doctorRoutes = router;

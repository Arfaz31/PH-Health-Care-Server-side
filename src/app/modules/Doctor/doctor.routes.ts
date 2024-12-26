import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllFromDB);
router.get("/:id", DoctorController.getByIdFromDB);
export const doctorRoutes = router;

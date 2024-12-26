import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllFromDB);
router.get("/:id", DoctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidation.updateDoctorProfileValidationSchema),
  DoctorController.updateIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.softDelete
);
export const doctorRoutes = router;

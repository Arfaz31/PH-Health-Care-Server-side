import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { uploadSingleImage } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../utils/imageValidationSchema";
import { parseBodyForFormData } from "../../middlewares/parseBodyForFormData";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllFromDB
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  userController.getMyProfile
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  uploadSingleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(userValidation.createAdminValidaionSchema),
  userController.createAdmin
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  uploadSingleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(userValidation.createDoctorValidaionSchema),
  userController.createDoctor
);
router.post(
  "/create-patient",
  uploadSingleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(userValidation.createPatientValidaionSchema),
  userController.createPatient
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidation.updateStatusValidationSchema),
  userController.changeProfileStatus
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  uploadSingleImage,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBodyForFormData,
  userController.updateMyProfile
);

export const userRoutes = router;

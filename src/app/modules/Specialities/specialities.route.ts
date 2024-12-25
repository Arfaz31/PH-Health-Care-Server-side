import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { uploadIcon } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../utils/imageValidationSchema";
import { parseBodyForFormData } from "../../middlewares/parseBodyForFormData";
import { SpecialitiesController } from "./specialities.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SpecialtiesValidtaion } from "./specialities.validation";

const router = Router();

router.get("/", SpecialitiesController.getAllFromDB);

router.post(
  "/create-specialist",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  uploadIcon,
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(SpecialtiesValidtaion.SpecialitiesValidationSchema),
  SpecialitiesController.inserSpecialistIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialitiesController.deleteFromDB
);

export const specialitiesRoutes = router;

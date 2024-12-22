import express from "express";
import { AdminController } from "./Admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./Admin.validation";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getSingleAdmin);
router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.update),
  AdminController.updateAdminData
);
router.delete("/:id", AdminController.deleteAdminData);
router.delete("/soft/:id", AdminController.softDeleteAdminData);
export const adminRoutes = router;

import express from "express";
import { AdminController } from "./Admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getSingleAdmin);
router.get("/:id", AdminController.updateAdminData);
router.delete("/:id", AdminController.deleteAdminData);
router.delete("/soft/:id", AdminController.softDeleteAdminData);
export const adminRoutes = router;

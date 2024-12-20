import express from "express";
import { AdminController } from "./Admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getSingleAdmin);
export const adminRoutes = router;

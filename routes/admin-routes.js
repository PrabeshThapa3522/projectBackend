
import express from "express";
import {
  addAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
  sendOtpForAdmin,
  verifyAdminOtp, // Only keep necessary functions here
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);
adminRouter.post("/verify-otp", verifyAdminOtp); // Keep only the necessary routes
adminRouter.post("/send-otp", sendOtpForAdmin);

export default adminRouter;


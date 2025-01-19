/*import express from "express";
import { addAdmin, adminLogin, getAdmins } from "../controllers/admin-controller.js"; // Named import

const adminRouter = express.Router();

// Route for admin signup
adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);

export default adminRouter;


import express from "express";
import {
  addAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);
adminRouter.post("/send-otp", sendOtpForAdmin);
adminRouter.post("/verify-otp", verifyAdminOtp);


export default adminRouter;
*/

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


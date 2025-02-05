
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getBookingsOfUser,
  getUserById,
  login,
  signup,
  updateUser,
  verifyOtp,  // Import the OTP verification route
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);  // Login route
userRouter.post("/verify-otp", verifyOtp);  // OTP Verification route
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;


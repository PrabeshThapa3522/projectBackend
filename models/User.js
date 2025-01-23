
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  otp: {  // OTP field
    type: String,
  },
  otpExpiration: {  // OTP expiration field
    type: Date,
  },
});

export default mongoose.model("User", userSchema);


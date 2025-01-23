
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  addedMovies: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
    },
  ],
  otp: {
    type: String, // OTP that will be sent to the admin's email
  },
  otpExpiration: {
    type: Number, // Timestamp for OTP expiration
  },
});

export default mongoose.model("Admin", adminSchema);



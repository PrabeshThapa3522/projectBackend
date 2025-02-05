/*import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Bookings from "../models/Bookings.js";


export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
  return res.status(200).json({ users });
};

export const addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Simplified validation check
  if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
  return res.status(201).json({ id: user._id });
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (errr) {
    return console.log(errr);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Sucessfully" });

};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Unable to find user from this ID" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ message: "Login Successfull", id: existingUser._id });
};

export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      //.populate("movie")
      //.populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings.js";
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ users });
};

export const singup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(201).json({ id: user._id });
};
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (errr) {
    return console.log(errr);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Sucessfully" });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Unable to find user from this ID" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ message: "Login Successfull", id: existingUser._id });
};
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate("movie")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};
*/


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";  // For 2FA generation and verification
import nodemailer from "nodemailer";  // For sending the secret via email
import Bookings from "../models/Bookings.js";

// Get all users (without 2FA logic)
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
  return res.status(200).json({ users });
};

// Signup with 2FA Secret generation
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password);

  // Generate 2FA secret (using speakeasy)
  const secret = speakeasy.generateSecret({ length: 20 });

  let user;
  try {
    // Create a new user with 2FA secret
    user = new User({
      name,
      email,
      password: hashedPassword,
      twoFASecret: secret.base32, // Store the 2FA secret in the DB
    });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }

  // Send the 2FA secret to user's email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Use environment variable for email
      pass: process.env.EMAIL_PASS,  // Use environment variable for password
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your 2FA Secret",
    text: `Use this secret in your authenticator app: ${secret.base32}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ message: "Error sending email" });
    } else {
      return res.status(201).json({ id: user._id, message: "2FA secret sent to email" });
    }
  });
};

// OTP Verification (Added Function)
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(422).json({ message: "Email and OTP are required" });
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving user" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify OTP using the stored 2FA secret
  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,  // Retrieve the stored 2FA secret
    encoding: "base32",
    token: otp,  // OTP entered by the user
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  return res.status(200).json({ message: "OTP Verified Successfully" });
};

// Login with 2FA verification
export const login = async (req, res, next) => {
  const { email, password, otp } = req.body;

  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "Unable to find user" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // // Verify OTP (2FA)
  // const verified = speakeasy.totp.verify({
  //   secret: existingUser.twoFASecret, // Use the stored secret for OTP verification
  //   encoding: "base32",
  //   token: otp, // OTP entered by the user
  // });

  // if (!verified) {
  //   return res.status(400).json({ message: "Invalid OTP" });
  // }

  return res.status(200).json({
    message: "Login Successful",
    id: existingUser._id,
  });
};

// Toggle 2FA (Enable/Disable)
export const toggle2FA = async (req, res, next) => {
  const { userId, enable } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (enable) {
    // Generate a new 2FA secret when enabling 2FA
    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFASecret = secret.base32; // Save the new secret
  } else {
    // Disable 2FA by clearing the secret
    user.twoFASecret = null;
  }

  try {
    await user.save();
    return res.status(200).json({ message: enable ? "2FA Enabled" : "2FA Disabled" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating 2FA" });
  }
};

// Get bookings of a user
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate("movie")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};

// Get a user by ID
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
  return res.status(200).json({ user });
};

// Update user
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword });
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Successfully" });
};

// Delete user
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

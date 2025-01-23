
import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import crypto from "crypto";

// Function to calculate total price for the booking
const calculateTotalPrice = (seatNumber) => {
  const pricePerSeat = 200; // Example price, update as needed
  return seatNumber * pricePerSeat;
};

// Function to generate eSewa URL for payment
const generateEsewaUrl = (booking, totalPrice) => {
  const esewaData = {
    amt: totalPrice,
    psc: 0,
    pdc: 0,
    txAmt: totalPrice,
    tAmt: totalPrice,
    pid: booking._id,
    su: `${process.env.FRONTEND_URL}/payment/callback?status=Success`,
    fu: `${process.env.FRONTEND_URL}/payment/callback?status=Failure`,
  };
  const productCode = "EPAYTEST";
  const secretKey = "8gBm/:&EnhH.1/q";

  // Prepare the message for signature
  const message = `total_amount=${esewaData.amt},transaction_uuid=${esewaData.pid},product_code=${productCode}`;

  // Generate the signature using HMAC-SHA256
  const signatureData = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  const formHtml = `    <html>
      <body >
        <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
          <input type="hidden" name="amount" value="${esewaData.amt}">
          <input type="hidden" name="tax_amount" value="0">
          <input type="hidden" name="total_amount" value="${esewaData.amt}">
          <input type="hidden" name="transaction_uuid" value="${esewaData.pid}">
          <input type="hidden" name="product_code" value="${productCode}">
          <input type="hidden" name="product_service_charge" value="0">
          <input type="hidden" name="product_delivery_charge" value="0">
          <input type="hidden" name="success_url" value="https://esewa.com.np">
          <input type="hidden" name="failure_url" value="https://google.com">
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code">
          <input type="hidden" name="signature" value="${signatureData}">
        </form>
        <script type="text/javascript">
          document.getElementById("esewaForm").submit();
        </script>
      </body>
    </html>`;

  return formHtml;
};

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  // Validate inputs
  if (!movie || !date || !seatNumber || !user) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Fetch Movie and User
  let existingMovie, existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
    console.log("Existing Movie:", existingMovie);
    console.log("Existing User:", existingUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching Movie/User", error: err });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID" });
  }

  // Create Booking
  let booking;
  try {
    booking = new Bookings({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    // session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    // await session.commitTransaction();
    console.log("Booking Created:", booking);
  } catch (err) {
    console.log("Booking Creation Error:", err);
    return res
      .status(500)
      .json({ message: "Error during booking creation", error: err });
  }

  // Calculate Total Price
  const totalPrice = calculateTotalPrice(seatNumber.length);
  console.log("Total Price:", totalPrice);

  // Generate eSewa URL
  const esewaUrl = generateEsewaUrl(booking, totalPrice);

  // return res.status(201).json({
  //   message: "Booking created successfully.",
  //   paymentUrl: esewaUrl,
  // });
  res.setHeader("Content-Type", "text/html");
  res.send(esewaUrl);
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }

  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};

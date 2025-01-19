/*import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given ID " });
  }

  let booking; // Fix: `let` for reassignment

  try {
    // Ensure the date is correctly formatted
    booking = new Bookings({
      movie,
      date: new Date(date), // Only pass `date` string to `new Date()`
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();
   
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error while creating booking" });
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking }); // Corrected: return the `booking` object, not `newBooking`
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

  /*export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;
    try {
      booking = await Bookings.findByIdAndDelete(id).populate("user movie");
      console.log(booking);
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

  export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;
  
    try {
      // Start a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
  
      // Find and delete the booking
      booking = await Bookings.findById(id).populate("user movie").session(session);
      if (!booking) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Remove references from User and Movie
      if (booking.user) {
        booking.user.bookings.pull(booking._id);
        await booking.user.save({ session });
      }
  
      if (booking.movie) {
        booking.movie.bookings.pull(booking._id);
        await booking.movie.save({ session });
      }
  
      // Delete booking
      await Bookings.findByIdAndDelete(id).session(session);
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error deleting booking" });
    }
  
    return res.status(200).json({ message: "Successfully Deleted", booking });
  };

  import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
  let booking;

  try {
    booking = new Bookings({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
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
    console.log(booking);
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

*/

import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

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

  const esewaUrl = new URL("https://esewa.com.np/epay/main");
  Object.keys(esewaData).forEach((key) =>
    esewaUrl.searchParams.append(key, esewaData[key])
  );

  return esewaUrl.toString();
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
    return res.status(500).json({ message: "Error fetching Movie/User", error: err });
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
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    await session.commitTransaction();
    console.log("Booking Created:", booking);
  } catch (err) {
    console.log("Booking Creation Error:", err);
    return res.status(500).json({ message: "Error during booking creation", error: err });
  }

  // Calculate Total Price
  const totalPrice = calculateTotalPrice(seatNumber);
  console.log("Total Price:", totalPrice);

  // Generate eSewa URL
  const esewaUrl = generateEsewaUrl(booking, totalPrice);
  console.log("Generated eSewa URL:", esewaUrl);

  return res.status(201).json({
    message: "Booking created successfully.",
    paymentUrl: esewaUrl,
  });
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


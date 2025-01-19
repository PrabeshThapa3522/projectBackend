/*import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use the routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter)
app.use("/booking", bookingsRouter )


// Database connection and server start
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusterpra.qt7av.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPRA`
  )
  .then(() =>
    app.listen(9000, () => {
      console.log("Connected to Database and Server is running on port 9000");
    })
  )
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
import { sendOtpEmail } from "./services/emailService.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use('/api/admin', adminRouter);

app.get("/test-email", async (req, res) => {
  try {
    await sendOtpEmail("test@example.com", "123456");
    res.status(200).send("Test email sent successfully.");
  } catch (err) {
    console.error("Error sending email:", err); // Log the exact error
    res.status(500).send(`Error sending test email: ${err.message}`);
  }
});

mongoose
  .connect(
     `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusterpra.qt7av.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPRA`
  )
  .then(() =>
    app.listen(9000, () =>
      console.log("Connected To Database And Server is running on port 9000")
    )
  )
  .catch((e) => console.log(e));
*/

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
import { sendOtpEmail } from "./services/emailService.js";
import axios from "axios";

// Load environment variables
dotenv.config();

// Check if eSewa Merchant ID and Secret Key are loaded properly
console.log("eSewa Merchant ID: ", process.env.ESWA_MERCHANT_ID);
console.log("eSewa Secret Key: ", process.env.ESWA_SECRET_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use('/api/admin', adminRouter);

// Test email route
app.get("/test-email", async (req, res) => {
  try {
    await sendOtpEmail("test@example.com", "123456");
    res.status(200).send("Test email sent successfully.");
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send(`Error sending test email: ${err.message}`);
  }
});

// eSewa Payment Intent route
app.post("/create-esewa-payment", async (req, res) => {
  const { totalPrice, orderId, productInfo } = req.body;

  // eSewa payment details
  const esewaPaymentData = {
    amt: totalPrice, // Total amount
    psc: 0, // Payment Service Charge
    pdc: 0, // Payment Discount
    txAmt: totalPrice, // Transaction amount
    tAmt: totalPrice, // Total amount to be paid
    pid: orderId, // Unique order ID
    su: `${process.env.FRONTEND_URL}/payment/success`, // Success URL
    fu: `${process.env.FRONTEND_URL}/payment/failure`, // Failure URL
    prodName: productInfo, // Product info like "Movie Ticket"
  };

  try {
    // API URL for eSewa payment initiation
    const apiUrl = "https://esewa.com.np/epay/main";
    
    // Send payment details to eSewa API
    const response = await axios.post(apiUrl, esewaPaymentData);

    // Handle the response and redirect the user to eSewa payment page
    res.send({
      paymentUrl: response.data.paymentUrl, // Redirect URL for eSewa
      message: "Payment initiation successful.",
    });
  } catch (error) {
    console.error("Error in eSewa payment creation:", error);
    res.status(500).send({ error: "Failed to create eSewa payment." });
  }
});
app.get("/payment/callback", (req, res) => {
  const paymentResponse = req.query;

  // Check if the payment was successful or failed based on the response
  const status = paymentResponse.status;

  if (status === "Success") {
    // Handle success case
    console.log("Payment Success:", paymentResponse);
    // You can update the order status in the database, etc.
    res.send("Payment successful! Your booking is confirmed.");
  } else {
    // Handle failure case
    console.log("Payment Failed:", paymentResponse);
    // You can take actions like canceling the order, showing an error, etc.
    res.send("Payment failed. Please try again.");
  }
});


// Connect to MongoDB and start server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clusterpra.qt7av.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPRA`
  )
  .then(() => {
    app.listen(9000, () => {
      console.log("Connected to Database and Server is running on port 9000");
    });
  })
  .catch((e) => {
    console.log("Database connection error:", e);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

  
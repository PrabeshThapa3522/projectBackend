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
*/

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

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
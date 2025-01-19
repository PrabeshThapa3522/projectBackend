import nodemailer from "nodemailer";

export const sendOtpEmail = async (recipientEmail, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Email address from environment variables
      pass: process.env.EMAIL_PASS, // Email password or App Password from environment variables
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
  } catch (err) {
    console.error("Error in sendOtpEmail:", err.message);
    throw new Error("Failed to send OTP email.");
  }
};






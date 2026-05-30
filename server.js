const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Robust Gmail transporter for Cloud Hosting
   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: subject || `New Portfolio Message From ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    // Logs the specific error to your Render dashboard for debugging
    console.error("Nodemailer Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// IMPORTANT: Render uses process.env.PORT automatically
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

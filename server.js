const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   Contact Route
========================= */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Debug logs
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS EXISTS:",
      process.env.EMAIL_PASS ? "YES" : "NO"
    );

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("SMTP Ready ✅");

    // Send email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,

      subject: subject || `Portfolio Message From ${name}`,

      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || "No Subject"}

Message:
${message}
      `,

      html: `
        <h2>New Portfolio Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "No Subject"}</p>

        <hr />

        <p>${message}</p>
      `,
    });

    console.log("Email Sent ✅", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully 🚀",
    });

  } catch (error) {
    console.error("FULL ERROR ❌");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ===== CORS FIX — Sab allow karein =====
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  credentials: true
}));

app.use(express.json());

// OTP store (memory mein)
const otpStore = {};

// ===== Professional Email Template =====
const getEmailTemplate = (otp, type) => {
  const titles = {
    signup: "Welcome to Galaxy Explorer",
    forgot: "Password Reset Request",
    login: "Login Verification Code"
  };
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0e1a; margin: 0; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid #1f2937; }
    .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 2px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .content { padding: 30px; color: #e5e7eb; }
    .otp-box { background: #1f2937; border: 2px solid #06b6d4; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 36px; font-weight: bold; color: #06b6d4; letter-spacing: 8px; font-family: monospace; }
    .warning { color: #fbbf24; font-size: 13px; margin-top: 10px; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 GALAXY EXPLORER</h1>
      <p>${titles[type] || "Verification Code"}</p>
    </div>
    <div class="content">
      <p>Hello Explorer,</p>
      <p>Your verification code for Galaxy Explorer is:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="warning">⏰ This code expires in 15 minutes</div>
      </div>
      <p>If you didn't request this code, please ignore this email.</p>
      <p style="margin-top: 20px;">Keep exploring the cosmos!<br>✦ ✦ ✦</p>
    </div>
    <div class="footer">
      Galaxy Explorer Team<br>
      This is an automated message, please do not reply.
    </div>
  </div>
</body>
</html>`;
};

// ===== SEND OTP =====
app.post("/send-otp", async (req, res) => {
  try {
    const { email, type = "forgot" } = req.body;

    console.log("📧 Request aayi email ke liye:", email);

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
      attempts: 0,
      verified: false
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Galaxy Explorer 🚀" <${process.env.EMAIL}>`,
      to: email,
      subject: "Galaxy Explorer - Your Verification Code",
      html: getEmailTemplate(otp, type),
    });

    console.log("✅ OTP bhej diya:", email);

    res.status(200).json({
      message: "OTP sent successfully",
      email: email
    });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
});

// ===== VERIFY OTP =====
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedData = otpStore[email];

  if (!storedData) {
    return res.status(400).json({ message: "OTP not found. Request new one." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired. Request new one." });
  }

  storedData.attempts++;
  if (storedData.attempts > 3) {
    delete otpStore[email];
    return res.status(400).json({ message: "Too many attempts. Request new OTP." });
  }

  if (storedData.otp !== otp.toString()) {
    return res.status(400).json({ 
      message: "Invalid OTP",
      attemptsLeft: 3 - storedData.attempts
    });
  }

  storedData.verified = true;

  return res.status(200).json({
    message: "OTP verified successfully",
    verified: true
  });
});

// ===== RESEND OTP =====
app.post("/resend-otp", async (req, res) => {
  const { email, type = "forgot" } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  delete otpStore[email];

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000,
    attempts: 0,
    verified: false
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Galaxy Explorer 🚀" <${process.env.EMAIL}>`,
      to: email,
      subject: "Galaxy Explorer - New Verification Code",
      html: getEmailTemplate(otp, type),
    });

    res.status(200).json({ message: "New OTP sent successfully" });

  } catch (error) {
    console.error("❌ Resend Error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

// ===== RESET PASSWORD =====
app.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const storedData = otpStore[email];
  
  if (!storedData || !storedData.verified) {
    return res.status(400).json({ message: "Please verify OTP first" });
  }

  delete otpStore[email];

  res.status(200).json({ message: "Password reset successfully" });
});

// ===== Health Check =====
app.get("/", (req, res) => {
  res.send("🚀 Galaxy Explorer OTP Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
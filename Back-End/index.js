const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const File = require("./file");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const otpStore = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kvbhargav174@gmail.com",
    pass: "cbom rtat sqlg ewzv",
  },
});

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected to DataBase !!"))
  .catch((err) => console.error("Database connection error:", err));

app.post("/register", async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;
    const existingUser = await File.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: "User already exists" });
    }
    const newUser = new File({ username, password, phoneNumber, file: [] });
    await newUser.save();
    res.status(200).json({ status: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await File.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ status: "Invalid password" });
    }
    res.status(200).json({ status: "Login successful" });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
});

app.post("/otp/generate", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ status: "Email is required" });
    }
    const user = await File.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[username] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    const mailOptions = {
      from: "kvbhargav174@gmail.com",
      to: username,
      subject: "Your OTP Code",
      text: `Your OTP verification code is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ status: "Failed to send OTP email" });
      }
      res.status(200).json({ status: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ status: error.message });
  }
});

app.post("/otp/validate", async (req, res) => {
  try {
    const { username, otp } = req.body;
    if (!username || !otp) {
      return res.status(400).json({ status: "Username and OTP are required" });
    }
    const user = await File.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: "Username not found" });
    }
    const storedOtp = otpStore[username];
    if (!storedOtp) {
      return res.status(404).json({ status: "OTP not found or expired" });
    }
    if (storedOtp.otp !== otp) {
      return res.status(400).json({ status: "Invalid OTP" });
    }
    if (Date.now() > storedOtp.expiresAt) {
      delete otpStore[username];
      return res.status(400).json({ status: "OTP expired" });
    }
    delete otpStore[username];
    res.status(200).json({
      status: "OTP validated successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).json({ status: error.message });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await File.findById(id);
    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }
    res.status(200).json({
      status: "User retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    res
      .status(500)
      .json({ status: "Error retrieving user", error: error.message });
  }
});

const totalSeats = 80;
app.get("/available-seats", async (req, res) => {
  try {
    const users = await File.find({});
    const allReservedSeats = users.flatMap((user) =>
      user.reservedSeats.map((seat) => seat.seatNumber)
    );

    const availableSeats = [];
    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
      if (!allReservedSeats.includes(seatNumber)) {
        availableSeats.push(seatNumber);
      }
    }

    res.status(200).json({ availableSeats });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
});

app.post("/reserve-seats", async (req, res) => {
  try {
    const { username, seatNumbers } = req.body;
    const user = await File.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const allReservedSeats = await File.aggregate([
      { $unwind: "$reservedSeats" },
      {
        $group: {
          _id: null,
          reservedSeats: { $addToSet: "$reservedSeats.seatNumber" },
        },
      },
    ]);

    const reservedSeats = allReservedSeats[0]?.reservedSeats || [];
    const alreadyReserved = seatNumbers.filter((seat) =>
      reservedSeats.includes(seat)
    );

    if (alreadyReserved.length > 0) {
      return res.status(400).json({
        status: "Some seats are already reserved",
        alreadyReserved,
      });
    }

    if (seatNumbers.some((seat) => seat < 1 || seat > totalSeats)) {
      return res.status(400).json({
        status: "Some selected seats are out of range",
      });
    }

    const newSeats = seatNumbers.map((seat) => ({ seatNumber: seat }));
    user.reservedSeats.push(...newSeats);
    await user.save();

    res.status(200).json({ status: "Seats reserved successfully" });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
});

const port = 8000;
app.set("port", port);
app.listen(port, () => {
  console.log(`Successfully connected to port: ${port}`);
});

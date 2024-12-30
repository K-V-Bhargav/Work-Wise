const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  reservedSeats: [
    {
      seatNumber: { type: Number, required: true },
      reservedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("seat", fileSchema);

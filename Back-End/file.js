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
  file: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("file", fileSchema);

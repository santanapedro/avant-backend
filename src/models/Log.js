const mongoose = require("mongoose");

const Log = new mongoose.Schema(
  {
    data: {
      type: Date,
      required: true
    },

    tipo: {
      type: String,
      required: true,
      lowercase: true
    },

    texto: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Log", Log);

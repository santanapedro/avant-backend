const mongoose = require("mongoose");

const Chuva = new mongoose.Schema(
  {
    dispositivo: {
      type: String,
      type: String,
      required: true
    },

    data: {
      type: Date,
      required: true
    },

    chuva: {
      type: String,
      upercase: true
    },

    status: {
      type: String,
      upercase: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Chuva", Chuva);

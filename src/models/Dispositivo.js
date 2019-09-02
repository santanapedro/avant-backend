const mongoose = require("mongoose");

const Dispositivo = new mongoose.Schema(
  {
    nome: {
      type: String,
      type: String,
      required: true,
      uppercase: true
    },

    local: {
      type: String,
      upercase: true
    },

    tipo: {
      type: String,
      required: true,
      upercase: true
    },

    status: {
      type: String,
      required: true,
      upercase: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Dispositivo", Dispositivo);

const mongoose = require("mongoose");

const Leitura = new mongoose.Schema(
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

    temperatura: {
      type: String,
      upercase: true
    },

    umidade: {
      type: String,
      upercase: true
    },

    pressao: {
      type: String,
      upercase: true
    },

    vlvento: {
      type: String,
      upercase: true
    },

    drvento: {
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

module.exports = mongoose.model("Leitura", Leitura);

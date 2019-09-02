const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Usuario = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      uppercase: true
    },

    sobrenome: {
      type: String,
      required: true,
      uppercase: true
    },

    telefone: {
      type: String,
      upercase: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },

    senha: {
      type: String,
      required: true,
      select: false
    },

    tipo: {
      type: String,
      required: true,
      upercase: true
    },

    notificacao: {
      type: String,
      required: true,
      upercase: true
    },

    codigo: {
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

Usuario.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

module.exports = mongoose.model("Usuario", Usuario);

const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authConfig = require("../config/auth");

module.exports = {
  //=======================================================================================

  async login(req, res) {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email }).select("+senha");

    if (!usuario)
      return res.status(201).send({ msg: "Usuario não encontrado!" });

    if (!(await bcrypt.compare(senha, usuario.senha)))
      return res.status(201).send({ msg: "Senha invalida!" });

    if (usuario.status === "I")
      return res.status(201).send({ msg: "Usuario Inativo" });

    if (usuario.status === "P")
      return res
        .status(201)
        .send({ msg: "Confirmação de conta via e-mail não realizada!" });

    usuario.senha = undefined;

    const token = jwt.sign({ id: usuario.id }, authConfig.secret, {
      expiresIn: 86400
    });

    return res.send({ usuario, token });
  },

  //=======================================================================================

  async valida(req, res) {
    const token = req.body.token;

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) return res.send(false);
      req.userId = decoded.id;
      return res.send(true);
    });
  }

  //=======================================================================================
};

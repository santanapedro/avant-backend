const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const authConfig = require("../config/auth");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "desenvolvimento.avant@gmail.com",
    pass: "sharpp123"
  },
  tls: { rejectUnauthorized: false }
});

const url = "http://192.168.15.15:3333";

class UsuarioController {
  //==========================================================================================================

  async ativaConta(req, res) {
    try {
      const _id = req.params.id;
      const data = { status: "A" };
      const response = await Usuario.findOne({ _id });

      if (response.status === "A") {
        return res.status(200)
          .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
        <div class="w3-container">\
          <p><strong>${response.nome}</strong>, esta conta ja está ativa!.</p>\
        </div></body></html>`);
      }

      if (response.status === "I") {
        return res.status(200)
          .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
        <div class="w3-container">\
          <p><strong>${response.nome}</strong>, esta conta ja está INATIVA, contate o administrador do sistema!.</p>\
        </div></body></html>`);
      }

      if (response) {
        await Usuario.findByIdAndUpdate(_id, { $set: data });
        return res.status(200)
          .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
        <div class="w3-container">\
          <p><strong>${response.nome}</strong>, sua conta foi ativada com sucesso!.</p>\
        </div></body></html>`);
      } else {
        return res.status(201)
          .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
        <div class="w3-container">\
          <p>Usuario não encontrato!.</p>\
        </div></body></html>`);
      }
    } catch (err) {
      return res.status(201).send({ msg: err.errmsg });
    }
  }

  //==========================================================================================================

  async alteraSenha(req, res) {
    try {
      await Usuario.findOne({ _id: req.params.id }, function(err, userFromDB) {
        if (userFromDB) {
          if (userFromDB.status !== "S") {
            return res.status(201)
              .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
          <div class="w3-container">\
            <p>Não existe solicitação de troca de senha para esse usuario.</p>\
          </div></body></html>`);
          }

          return res.status(200)
            .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA</font></h1></header>

              <div class="w3-container">\
              <p><strong>${userFromDB.nome}</strong>, digite sua nova senha!.</p>\
              </div>
                <form action="http://192.168.15.15:3333/senha/${userFromDB._id}" method="post">
               
                  <div> 
                <label for="name">Senha:</label>
                    <input type="password" id="name" name="senha" required pattern=".{6,}"  >
                  </div>
                <div class="w3-container">\
                <p>a senha deve conter no minimo 6 caracteres</p>\
                </div>
                  <div class="button">
                    <button type="submit">ALTERAR SENHA</button>
                  </div>
                </form>`);
        } else {
          return res.status(201)
            .send(`<html><body ><header color="#588c7e"><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
      <div class="w3-container">\
        <p>Usuario não encontrado!.</p>\
      </div></body></html>`);
        }
      });
    } catch (err) {
      return res.status(201).send({ msg: err.errmsg });
    }
  }

  //==========================================================================================================

  async enviaalteraSenha(req, res) {
    try {
      await Usuario.findOne({ email: req.body.email }, async function(
        err,
        userFromDB
      ) {
        if (userFromDB) {
          const mailOptions = {
            from: "Avant Tecnologia",
            to: userFromDB.email,
            subject: "Codigo de verificação AVANT",
            html: `<body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
            <div class="w3-container">\
              <p>Oi <strong>${userFromDB.nome}</strong>, para efetuar a troca de senha clique no link abaixo.</p>\
              <p><a href="${url}/alterasenha/${userFromDB._id}">NOVA SENHA</a></p>\
            </div></body></html>`
          };

          const data = { status: "S" };
          const _id = userFromDB._id;

          await Usuario.findByIdAndUpdate(_id, { $set: data });

          await transporter.sendMail(mailOptions, async function(error, info) {
            if (error) {
              return res.status(201).send({ msg: error });
            } else {
              console.log("Email enviado: " + info.response);
              return res.status(200).send({ msg: "email enviado!" });
            }
          });
        } else {
          return res.status(201).send({ msg: "email informado inexistente" });
        }
      });
    } catch (err) {
      return res.status(201).send({ msg: err.errmsg });
    }
  }

  //==========================================================================================================

  async senha(req, res) {
    const hash = await bcrypt.hash(req.body.senha, 10);
    req.body.senha = hash;
    req.body.status = "A";
    try {
      await Usuario.findByIdAndUpdate(req.params.id, { $set: req.body });
      return res.status(200)
        .send(`<html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
          <div class="w3-container">\
            <p>Senha alterada com sucesso!.</p>\
          </div></body></html>`);
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //==========================================================================================================

  async cadastraUsuario(req, res) {
    var data = req.body;
    data.tipo = "MOBILE";
    data.notificacao = "S";
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    data.codigo = Math.floor(Math.random() * (max - min + 1)) + min;
    data.status = "P";

    try {
      const email = req.body.email;

      if (await Usuario.findOne({ email }))
        return res.status(201).send({ msg: "Usuario ja registrado!" });

      const usuario = await Usuario.create(data);
      usuario.senha = undefined;
      const token = jwt.sign({ id: usuario.id }, authConfig.secret, {
        expiresIn: 86400
      });

      const mailOptions = {
        from: "Avant Tecnologia",
        to: req.body.email,
        subject: "E-mail de verificação AVANT",
        html: `<body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>\
          <div class="w3-container">\
            <p>Oi <strong>${usuario.nome}</strong>. Seja bem vindo(a) ao nosso App!, clique no link abaixo para ativar a sua conta.</p>\
            <p><a href="${url}/ativa/${usuario._id}">ATIVAR CONTA</a></p>\
          </div></body></html>`
      };

      await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return res.status(201).send({ msg: error });
        } else {
          console.log("Email enviado: " + info.response);
          return res.status(200).json({ usuario, token });
        }
      });
    } catch (err) {
      return res.status(201).send({ msg: err.errmsg });
    }
  }

  //==========================================================================================================

  async index(req, res) {
    try {
      const usuarios = await Usuario.find({}).sort("-createdAt");
      return res.status(200).json(usuarios);
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  }

  //==========================================================================================================

  async store(req, res) {
    const { email } = req.body;

    try {
      if (await Usuario.findOne({ email }))
        return res.status(400).send({ msg: "Usuario ja registrado!" });

      const usuario = await Usuario.create(req.body);
      usuario.password = undefined;
      const token = jwt.sign({ id: usuario.id }, authConfig.secret, {
        expiresIn: 86400
      });

      return res.status(200).json({ usuario, token });
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  }

  //==========================================================================================================

  async update(req, res) {
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;

    try {
      await Usuario.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).send({ msg: "Usuario atualizado com sucesso!" });
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //==========================================================================================================

  async delete(req, res) {
    try {
      await Usuario.findByIdAndDelete(req.params.id, { $set: req.body });
      res.status(200).send({ msg: "O usuario foi deletado com sucesso!" });
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //==========================================================================================================
}

module.exports = new UsuarioController();

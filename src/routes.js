const express = require("express");
const routes = express.Router();

const LoginController = require("./controllers/LoginController");
routes.post("/login", LoginController.login);
routes.post("/valida", LoginController.valida);

//=========================================================================================

const UsuarioController = require("./controllers/UsuarioController");
routes.post("/cadastrausuario", UsuarioController.cadastraUsuario);
routes.get("/ativa/:id", UsuarioController.ativaConta);
routes.get("/alterasenha/:id", UsuarioController.alteraSenha);
routes.post("/enviaalterasenha", UsuarioController.enviaalteraSenha);
routes.post("/senha/:id", UsuarioController.senha);

//=========================================================================================

//const DispositivoController = require("./controllers/DispositivoController");
//routes.post("/cadastradispositivo", DispositivoController.store);

//=========================================================================================

const LeiruraController = require("./controllers/LeituraControler");
routes.get("/leitura", LeiruraController.leitura);
routes.get("/chuva", LeiruraController.chuva);

module.exports = routes;

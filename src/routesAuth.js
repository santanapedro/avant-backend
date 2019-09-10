const express = require("express");

const routesAuth = express.Router();
const authMiddleware = require("./middleware/auth");

routesAuth.use(authMiddleware);

//=========================================================================================

const UsuarioController = require("./controllers/UsuarioController");

routesAuth.post("/usuario", UsuarioController.store);
routesAuth.put("/usuario/:id", UsuarioController.update);
routesAuth.delete("/usuario/:id", UsuarioController.delete);
routesAuth.get("/usuario", UsuarioController.index);

const DashboardController = require("./controllers/DashboardController");
routesAuth.get("/buscaultimo", DashboardController.BuscaUltimo);
routesAuth.get("/chuvadia", DashboardController.ChuvaDia);
routesAuth.get("/chuvahora/:datachuva", DashboardController.ChuvaHora);
routesAuth.get("/graficosemana", DashboardController.GraficoSemana);
routesAuth.get("/graficohora/:data", DashboardController.GraficoHora);
routesAuth.get("/maximasdia/:data", DashboardController.maximasDia);

module.exports = routesAuth;

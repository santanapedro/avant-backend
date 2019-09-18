const Leitura = require("../models/Leitura");
const Chuva = require("../models/Chuva");
const Dispositivo = require("../models/Dispositivo");
const Log = require("../models/Log");

const moment = require("moment");

class LeituraController {
  //==================================================================================================

  async leitura(req, res) {
    try {
      const _id = req.query.dispositivo;
      req.query.data = moment(req.query.data, "DD-MM-YYYYThh-mm-ss").format();
      req.query.status = "A";

      await Dispositivo.findById(_id, function(err) {
        if (err) return res.status(201).send("ID do dispositivo inexistente!");
      });

      if (req.query.temperatura === "nan" || req.query.umidade === "nan") {
        var gravaLog = {
          data: req.query.data,
          tipo: "LEITURA",
          texto: `${moment(req.query.data).format(
            "DD/MM/YYYY, hh:mm"
          )} - FALHA NA LEITURA`
        };
        await Log.create(gravaLog);
        req.io.emit("erro", gravaLog);
        return res.status(200).send("ERRO ESTRUTURA");
      } else {
        if (req.query.drvento >= 1000 && req.query.drvento <= 1200) {
          req.query.drvento = "N";
        } else if (req.query.drvento >= 150 && req.query.drvento <= 250) {
          req.query.drvento = "Ne";
        } else if (req.query.drvento >= 1600 && req.query.drvento <= 1750) {
          req.query.drvento = "L";
        } else if (req.query.drvento >= 400 && req.query.drvento <= 500) {
          req.query.drvento = "SE";
        } else if (req.query.drvento >= 2400 && req.query.drvento <= 2500) {
          req.query.drvento = "S";
        } else if (req.query.drvento >= 600 && req.query.drvento <= 700) {
          req.query.drvento = "SO";
        } else if (req.query.drvento >= 0 && req.query.drvento <= 49) {
          req.query.drvento = "O";
        } else if (req.query.drvento >= 50 && req.query.drvento <= 100) {
          req.query.drvento = "NO";
        } else {
          const data = await Leitura.findOne().sort({ data: -1 });
          req.query.drvento = data.drvento;
        }

        req.query.vlvento = req.query.vlvento / 2;

        await Leitura.create(req.query, function(err) {
          if (err) {
            console.log(err);
            return res.status(201).send("Erro ao gravar no BD");
          } else {
            req.io.emit("leitura", req.query);
            console.log(
              "DADO GRAVADO - ",
              moment().format("DD/MM/YYYY hh:mm:ss"),
              req.query.drvento
            );

            return res.status(200).send("DADO GRAVADO");
          }
        });
      }
    } catch (msg) {
      console.log(msg);
      var gravaLog = {
        data: req.query.data,
        tipo: "LEITURA",
        texto: `${moment(req.query.data).format(
          "DD/MM/YYYY, hh:mm"
        )} - FALHA NA LEITURA = ${msg}`
      };
      await Log.create(gravamsgLog);
      return res.status(400).send("ERRO AO GRAVAR");
    }
  }

  //==================================================================================================

  async chuva(req, res) {
    try {
      const _id = req.query.dispositivo;
      req.query.data = moment(req.query.data, "DD-MM-YYYYThh-mm-ss").format();
      req.query.status = "A";

      await Dispositivo.findById(_id, function(err) {
        if (err) return res.status(201).send("ID do dispositivo inexistente!");
      });

      await Chuva.create(req.query, async function(err) {
        if (err) {
          var gravaLog = {
            data: req.query.data,
            tipo: "CHUVA",
            texto: `${moment(req.query.data).format(
              "DD/MM/YYYY, hh:mm"
            )} - ${err}`
          };
          await Log.create(gravaLog);
          return res.status(201).send("Erro ao gravar no BD");
        } else {
          req.io.emit("chuva", req.query);
          console.log("CHUVA GRAVADA");
          return res.status(200).send("DADO GRAVADO");
        }
      });
    } catch (msg) {
      var gravaLog = {
        data: req.query.data,
        tipo: "CHUVA",
        texto: `${moment(req.query.data).format("DD/MM/YYYY, hh:mm")} - ${msg}`
      };
      await Log.create(gravaLog);
      return res.status(400).send("ERRO AO GRAVAR");
    }
  }
}

module.exports = new LeituraController();

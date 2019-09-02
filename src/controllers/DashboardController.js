const Leitura = require("../models/Leitura");
const Chuva = require("../models/Chuva");

const moment = require("moment");

class DashboardController {
  //==================================================================================================

  async BuscaUltimo(req, res) {
    try {
      const data = await Leitura.findOne().sort({ data: -1 });
      return res.status(200).json(data);
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  }

  //==================================================================================================

  async ChuvaDia(req, res) {
    try {
      const date = moment().format("YYYY-MM-DD");

      const chuva = await Chuva.find({
        $where: `this.data.toJSON().slice(0, 10) == "${date}"`
      });

      const data = await Chuva.findOne().sort({ data: -1 });

      const response = {
        quantidade: chuva.length * 0.25,
        dia: data.data
      };

      return res.status(200).json(response);
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  }

  //==================================================================================================

  async ChuvaHora(req, res) {
    try {
      const date = moment().format("YYYY-MM-DD");

      const chuva = await Chuva.find({
        $where: `this.data.toJSON().slice(0, 10) == "${date}"`
      });

      for (let index = 0; index < chuva.length; index++) {
        console.log;
      }

      const response = {
        quantidade: chuva.length * 0.25,
        dia: data.data
      };

      return res.status(200).json(response);
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  }

  //==================================================================================================

  async GraficoSemana(req, res) {
    var labels = [];

    var datasets = [
      {
        label: "TEMP MAXIMA",
        data: [],
        backgroundColor: "rgba(245, 74, 85, 0.7)",
        borderWidth: 1
      },
      {
        label: "TEMP MINIMA",
        data: [],
        backgroundColor: "rgba(245, 74, 85, 0.5)",
        borderWidth: 1
      },
      {
        label: "UMID MAXIMA",
        data: [],
        backgroundColor: "rgba(90, 173, 246, 0.7)",
        borderWidth: 1
      },
      {
        label: "UMID MINIMA",
        data: [],
        backgroundColor: "rgba(90, 173, 246, 0.5)",
        borderWidth: 1
      }
    ];

    try {
      for (var i = 1; i <= 7; i++) {
        var dia = new Date(moment().subtract(i, "days"));

        labels.push(
          moment(dia)
            .add(1, "days")
            .format("DD/MM/YYYY")
        );

        const date = moment(dia)
          .add(1, "days")
          .format("YYYY-MM-DD");

        const TemperaturaMaxima = await Leitura.findOne({
          $where: `this.data.toJSON().slice(0, 10) == "${date}"`
        }).sort({ temperatura: -1 });

        const TemperaturaMinima = await Leitura.findOne({
          $where: `this.data.toJSON().slice(0, 10) == "${date}"`
        }).sort({ temperatura: 1 });

        const UmidadeMaxima = await Leitura.findOne({
          $where: `this.data.toJSON().slice(0, 10) == "${date}"`
        }).sort({ umidade: -1 });

        const UmidadeMinima = await Leitura.findOne({
          $where: `this.data.toJSON().slice(0, 10) == "${date}"`
        }).sort({ umidade: 1 });

        if (TemperaturaMaxima) {
          datasets[0].data.push(
            parseFloat(TemperaturaMaxima.temperatura).toFixed(2)
          );
        } else {
          datasets[0].data.push(0);
        }

        if (TemperaturaMinima) {
          datasets[1].data.push(
            parseFloat(TemperaturaMinima.temperatura).toFixed(2)
          );
        } else {
          datasets[1].data.push(0);
        }

        if (UmidadeMaxima) {
          datasets[2].data.push(parseFloat(UmidadeMaxima.umidade).toFixed(2));
        } else {
          datasets[2].data.push(0);
        }

        if (UmidadeMinima) {
          datasets[3].data.push(parseFloat(UmidadeMinima.umidade).toFixed(2));
        } else {
          datasets[3].data.push(0);
        }
      }

      var dataBar = { labels, datasets };

      return res.status(200).json(dataBar);
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  //==================================================================================================
}

module.exports = new DashboardController();

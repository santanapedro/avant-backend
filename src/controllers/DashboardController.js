const Leitura = require("../models/Leitura");
const Chuva = require("../models/Chuva");

const moment = require("moment");
const timeZone = require("moment-timezone");

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
        data: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 99)
        }
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
      var labels = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23"
      ];

      var datasets = [
        {
          label: "CHUVA (mm)",
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          backgroundColor: "rgba(90, 173, 246, 0.7)",
          borderWidth: 1
        }
      ];

      const chuva = await Chuva.find({
        data: {
          $gte: new Date(
            moment(req.params.datachuva, "DD-MM-YYYY").format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment(req.params.datachuva, "DD-MM-YYYY").format()
          ).setHours(23, 59, 59, 99)
        }
      });

      for (let index = 0; index < chuva.length; index++) {
        var h = new Date(chuva[index].data);
        switch (h.getHours()) {
          case 0:
            datasets[0].data[0] = datasets[0].data[0] + 0.25;
            break;
          case 1:
            datasets[0].data[1] = datasets[0].data[1] + 0.25;
            break;
          case 2:
            datasets[0].data[2] = datasets[0].data[2] + 0.25;
            break;
          case 3:
            datasets[0].data[3] = datasets[0].data[3] + 0.25;
            break;
          case 4:
            datasets[0].data[4] = datasets[0].data[4] + 0.25;
            break;
          case 5:
            datasets[0].data[5] = datasets[0].data[5] + 0.25;
            break;
          case 6:
            datasets[0].data[6] = datasets[0].data[6] + 0.25;
            break;
          case 7:
            datasets[0].data[7] = datasets[0].data[7] + 0.25;
            break;
          case 8:
            datasets[0].data[8] = datasets[0].data[8] + 0.25;
            break;
          case 9:
            datasets[0].data[9] = datasets[0].data[9] + 0.25;
            break;
          case 10:
            datasets[0].data[10] = datasets[0].data[10] + 0.25;
            break;
          case 11:
            datasets[0].data[11] = datasets[0].data[11] + 0.25;
            break;
          case 12:
            datasets[0].data[12] = datasets[0].data[12] + 0.25;
            break;
          case 13:
            datasets[0].data[13] = datasets[0].data[13] + 0.25;
            break;
          case 14:
            datasets[0].data[14] = datasets[0].data[14] + 0.25;
            break;
          case 15:
            datasets[0].data[15] = datasets[0].data[15] + 0.25;
            break;
          case 16:
            datasets[0].data[16] = datasets[0].data[16] + 0.25;
            break;
          case 17:
            datasets[0].data[17] = datasets[0].data[17] + 0.25;
            break;
          case 18:
            datasets[0].data[18] = datasets[0].data[18] + 0.25;
            break;
          case 19:
            datasets[0].data[19] = datasets[0].data[19] + 0.25;
            break;
          case 20:
            datasets[0].data[20] = datasets[0].data[20] + 0.25;
            break;
          case 21:
            datasets[0].data[21] = datasets[0].data[21] + 0.25;
            break;
          case 22:
            datasets[0].data[22] = datasets[0].data[22] + 0.25;
            break;
          case 23:
            datasets[0].data[23] = datasets[0].data[23] + 0.25;
            break;
        }
      }

      var dataBar = { labels, datasets };

      return res.status(200).json(dataBar);
    } catch (msg) {
      console.log(msg);
      return res.status(400).send({ msg: msg });
    }
  }

  //==================================================================================================

  async GraficoSemana(req, res) {
    var labels = [];
    console.log(new Date(req.params.data));
    var dataBusca = new Date(req.params.data);
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
        var dia = new Date(
          moment(dataBusca)
            .subtract(i, "days")
            .format()
        );

        labels.push(
          moment(dia)
            .add(1, "days")
            .format("DD/MM/YYYY")
        );

        const date = moment(dia)
          .add(1, "days")
          .format("YYYY-MM-DD");

        const TemperaturaMaxima = await Leitura.findOne({
          data: {
            $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              0,
              0,
              0,
              0
            ),
            $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              23,
              59,
              59,
              99
            )
          }
        }).sort({ temperatura: -1 });

        const TemperaturaMinima = await Leitura.findOne({
          data: {
            $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              0,
              0,
              0,
              0
            ),
            $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              23,
              59,
              59,
              99
            )
          }
        }).sort({ temperatura: 1 });

        const UmidadeMaxima = await Leitura.findOne({
          data: {
            $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              0,
              0,
              0,
              0
            ),
            $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              23,
              59,
              59,
              99
            )
          }
        }).sort({ umidade: -1 });

        const UmidadeMinima = await Leitura.findOne({
          data: {
            $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              0,
              0,
              0,
              0
            ),
            $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
              23,
              59,
              59,
              99
            )
          }
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

  async GraficoHora(req, res) {
    var data = req.params.data;
    var leitura;

    try {
      var labels = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23"
      ];

      var datasets = [
        {
          label: "TEMP MAXIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(245, 74, 85,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(245, 74, 85,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(245, 74, 85,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 3
        },
        {
          label: "TEMP MINIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(245, 74, 85,0.5)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(245, 74, 85,0.5)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(245, 74, 85,0.5)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 2
        },
        {
          label: "UMID MAXIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(90, 173, 246, 1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(90, 173, 246, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(90, 173, 246, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 3
        },
        {
          label: "UMID MINIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(90, 173, 246, 0.5)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(90, 173, 246, 0.5)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(90, 173, 246, 0.5)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 2
        }
      ];

      // ========================================  TEMPERATURA MAXIMA ===========================================

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i}:59:59.000-04:00`)
            }
          }).sort({ temperatura: -1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i}:59:59.000-04:00`)
            }
          }).sort({ temperatura: -1 });
        }

        if (leitura) {
          datasets[0].data.push(parseFloat(leitura.temperatura).toFixed(2));
        } else {
          datasets[0].data.push(0);
        }
      }

      // ========================================  TEMPERATURA MINIMA ===========================================

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i}:59:59.000-04:00`)
            }
          }).sort({ temperatura: 1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i}:59:59.000-04:00`)
            }
          }).sort({ temperatura: 1 });
        }

        if (leitura) {
          datasets[1].data.push(parseFloat(leitura.temperatura).toFixed(2));
        } else {
          datasets[1].data.push(0);
        }
      }

      // ========================================  UMIDADE MAXIMA ===========================================

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i}:59:59.000-04:00`)
            }
          }).sort({ umidade: -1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i}:59:59.000-04:00`)
            }
          }).sort({ umidade: -1 });
        }

        if (leitura) {
          datasets[2].data.push(parseFloat(leitura.umidade).toFixed(2));
        } else {
          datasets[2].data.push(0);
        }
      }

      // ========================================  UMIDADE MINIMA ===========================================

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i}:59:59.000-04:00`)
            }
          }).sort({ umidade: 1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i}:59:59.000-04:00`)
            }
          }).sort({ umidade: 1 });
        }

        if (leitura) {
          datasets[3].data.push(parseFloat(leitura.umidade).toFixed(2));
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

  //================================================================================================

  async maximasDia(req, res) {
    try {
      const date = req.params.data;

      const TemperaturaMaxima = await Leitura.findOne({
        data: {
          $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            0,
            0,
            0,
            0
          ),
          $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            23,
            59,
            59,
            99
          )
        }
      }).sort({ temperatura: -1 });

      const TemperaturaMinima = await Leitura.findOne({
        data: {
          $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            0,
            0,
            0,
            0
          ),
          $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            23,
            59,
            59,
            99
          )
        }
      }).sort({ temperatura: 1 });

      const UmidadeMaxima = await Leitura.findOne({
        data: {
          $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            0,
            0,
            0,
            0
          ),
          $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            23,
            59,
            59,
            99
          )
        }
      }).sort({ umidade: -1 });

      const UmidadeMinima = await Leitura.findOne({
        data: {
          $gte: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            0,
            0,
            0,
            0
          ),
          $lt: new Date(moment(date, "YYYY-MM-DD").format()).setHours(
            23,
            59,
            59,
            99
          )
        }
      }).sort({ umidade: 1 });

      var response = {
        TemperaturaMaxima,
        TemperaturaMinima,
        UmidadeMaxima,
        UmidadeMinima
      };

      return res.status(200).json(response);
    } catch (msg) {
      console.log(msg);
      return res.status(400).send(msg);
    }
  }

  //==================================================================================================

  async maximasHora(req, res) {
    var data = req.params.data;
    var leitura;

    try {
      var labels = [
        "00",
        "02",
        "04",
        "06",
        "08",
        "10",
        "12",
        "14",
        "16",
        "18",
        "20",
        "22"
      ];

      var datasets = [
        {
          label: "TEMP MAXIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(245, 74, 85,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(245, 74, 85,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(245, 74, 85,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 3
        },

        {
          label: "UMID MAXIMA",
          data: [],
          backgroundColor: "rgba(245, 74, 85, 0.0)",
          borderColor: "rgba(90, 173, 246, 1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(90, 173, 246, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(90, 173, 246, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          borderWidth: 3
        }
      ];

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i + 1}:59:59.000-04:00`)
            }
          }).sort({ temperatura: -1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i + 1}:59:59.000-04:00`)
            }
          }).sort({ temperatura: -1 });
        }

        if (leitura) {
          datasets[0].data.push(parseFloat(leitura.temperatura).toFixed(2));
        } else {
          datasets[0].data.push(0);
        }

        i = i + 1;
      }

      // ========================================  UMIDADE MAXIMA ===========================================

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT0${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT0${i + 1}:59:59.000-04:00`)
            }
          }).sort({ umidade: -1 });
        } else {
          leitura = await Leitura.findOne({
            data: {
              $gte: moment(data).format(`YYYY-MM-DDT${i}:00:00.000-04:00`),
              $lte: moment(data).format(`YYYY-MM-DDT${i + 1}:59:59.000-04:00`)
            }
          }).sort({ umidade: -1 });
        }

        if (leitura) {
          datasets[1].data.push(parseFloat(leitura.umidade).toFixed(2));
        } else {
          datasets[1].data.push(0);
        }

        i = i + 1;
      }

      var dataBar = { labels, datasets };

      return res.status(200).json(dataBar);
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }
}

module.exports = new DashboardController();

var OneSignal = require("onesignal-node");
const nodemailer = require("nodemailer");
const Leitura = require("../models/Leitura");
const Chuva = require("../models/Chuva");
const Usuario = require("../models/Usuario");

const moment = require("moment");
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

const url = "https://avant-backend.herokuapp.com";
//const url = "http://192.168.15.15:3333";

class NotificacoController {
  //==========================================================================================================

  async notificaTodos(req, res) {
    const mensagem = "TESTE";

    var myClient = new OneSignal.Client({
      userAuthKey: "NTIwMjA1MjEtZDMxOC00N2FmLWFmMDYtYTgwZTk4MmRiZThm",
      app: {
        appAuthKey: "NzZmZTBlZDYtYmQzZC00N2I5LWE2MGQtM2M3MTcyYzlmMWE3",
        appId: "04bfa0fb-4231-419c-807c-482a0a841c27"
      }
    });

    var firstNotification = new OneSignal.Notification({
      contents: {
        en: mensagem
      }
    });

    // set target users
    firstNotification.postBody["included_segments"] = ["Active Users"];
    firstNotification.postBody["excluded_segments"] = ["Banned Users"];

    // set notification parameters
    firstNotification.postBody["data"] = { abc: "123", foo: "bar" };
    firstNotification.postBody["send_after"] = new Date();

    // send this notification to All Users except Inactive ones
    myClient.sendNotification(firstNotification, function(
      err,
      httpResponse,
      data
    ) {
      if (err) {
        console.log("Something went wrong...");
        return res.status(200);
      } else {
        console.log(data, httpResponse.statusCode);
        return res.status(200).json({ ok: true });
      }
    });
  }

  async diario(req, res) {
    try {
      const TemperaturaMaxima = await Leitura.findOne({
        data: {
          $gte: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(23, 59, 59, 99)
        }
      }).sort({ temperatura: -1 });

      const TemperaturaMinima = await Leitura.findOne({
        data: {
          $gte: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(23, 59, 59, 99)
        }
      }).sort({ temperatura: 1 });

      const UmidadeMaxima = await Leitura.findOne({
        data: {
          $gte: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(23, 59, 59, 99)
        }
      }).sort({ umidade: -1 });

      const UmidadeMinima = await Leitura.findOne({
        data: {
          $gte: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(23, 59, 59, 99)
        }
      }).sort({ umidade: 1 });

      const chuva = await Chuva.find({
        data: {
          $gte: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(0, 0, 0, 0),
          $lt: new Date(
            moment()
              .subtract(1, "days")
              .format()
          ).setHours(23, 59, 59, 99)
        }
      });

      const notificacao = "S";
      const usuarios = await Usuario.find({ notificacao });

      if (usuarios) {
        for (let i = 0; i < usuarios.length; i++) {
          const mailOptions = {
            from: "Avant Tecnologia",
            to: usuarios[i].email,
            subject: "Informativo Diario",
            html: `</html><body><header><h1> <font color="#588c7e">AVANT TECNOLOGIA </font></h1></header>
            <div class="w3-container">
              <p>Bom dia <strong>${
                usuarios[i].nome
              }</strong>, este boletim contem algumas informações coletadas pela nossa estação no dia de ontem (${moment()
              .subtract(1, "days")
              .format("DD/MM/YYYY")}):</p>
              <ul>
                 <p><strong> <font color="#B22222">TEMPERATURA</font></strong></p>
                <li>Maxima:<strong> ${parseFloat(
                  TemperaturaMaxima.temperatura
                ).toFixed(2)}</strong> °C as ${moment(
              TemperaturaMaxima.data
            ).format("HH:mm:ss")}</li>
                <li>Minima:<strong> ${parseFloat(
                  TemperaturaMinima.temperatura
                ).toFixed(2)}</strong> °C as ${moment(
              TemperaturaMinima.data
            ).format("HH:mm:ss")}</li>
                <p><strong><font color="#4682B4">UMIDADE</font></strong></p>
                <li>Maxima:<strong> ${parseFloat(UmidadeMaxima.umidade).toFixed(
                  2
                )}</strong>% as ${moment(UmidadeMaxima.data).format(
              "HH:mm:ss"
            )}</li>
                <li>Minima:<strong> ${parseFloat(UmidadeMinima.umidade).toFixed(
                  2
                )}</strong>% as ${moment(UmidadeMinima.data).format(
              "HH:mm:ss"
            )}</li>
                <p><strong><font color="#191970">CHUVA</font></strong></p>
                <li>Quantidade: ${chuva.length * 0.25}mm</li>
              </ul>
                  
              <p>Obrigado pela atenção! Duvidas ou informações no contato <strong>(65) 9 9639-3517</strong></p>
              <p></p>
              <p></p>
              <p><a href="${url}/cancelanotifica/${
              usuarios[i]._id
            }">Não receber informativo</a></p>\
        </div></body></html>`
          };

          await transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log(
                "Email enviado para: " +
                  usuarios[i].email +
                  " - " +
                  info.response
              );
            }
          });
        }
      }

      return;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  //=================================================================================================
}
module.exports = new NotificacoController();

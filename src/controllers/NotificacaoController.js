var OneSignal = require("onesignal-node");

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

  //=================================================================================================
}
module.exports = new NotificacoController();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment");
const app = express();
const notifica = require("./controllers/NotificacaoController");
const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect("mongodb://avant:avant9639@ds263307.mlab.com:63307/avant", {
  useNewUrlParser: true,
  useCreateIndex: true
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

async function service() {
  setTimeout(function() {
    const hora = String(moment().format("hh:mm a"));
    if (hora === "07:15 pm") {
      notifica.diario();
    }

    console.log(moment().format("DD/MM/YYYY, hh:mm"));

    service();
  }, 60000);
}

service();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes"));
app.use(require("./routesAuth"));

server.listen(process.env.PORT || 3333);

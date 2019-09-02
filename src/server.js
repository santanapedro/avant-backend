const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes"));
app.use(require("./routesAuth"));

server.listen(process.env.PORT || 3333);

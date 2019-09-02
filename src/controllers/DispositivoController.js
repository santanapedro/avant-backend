const Dispositivo = require("../models/Dispositivo");

class DispositivoController {
  //========================================================================================

  async index(req, res) {
    try {
      const dispositivos = await Dispositivo.find({}).sort("-createdAt");
      res.status(200).json(dispositivos);
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //========================================================================================

  async store(req, res) {
    try {
      const dispositivo = await Dispositivo.create(req.body);
      res.status(200).json(dispositivo);
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //========================================================================================

  async delete(req, res) {
    try {
      await Dispositivo.findByIdAndDelete(req.params.id);
      res.status(200).send({ msg: "Dispositivo removido com sucesso!" });
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //========================================================================================

  async update(req, res) {
    try {
      await Dispositivo.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).send({ msg: "Dispositivo atualizado com sucesso!" });
    } catch (msg) {
      res.status(400).send({ msg });
    }
  }

  //========================================================================================
}

module.exports = new DispositivoController();

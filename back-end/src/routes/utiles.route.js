const express = require("express");
const router = express.Router();
const Utiles = require("../models/utiles.model");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId

// Ruta POST

router.post("/", async(req, res) => {
    const{nombre, descripcion, cantidad} = req.body;
    if (!nombre || !descripcion || !cantidad){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoUtil = new Utiles({nombre, descripcion, cantidad});
        await nuevoUtil.save()
        res.status(201).json(nuevoUtil);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const utiles = await Utiles.find();
        res.json(utiles);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const util = await Utiles.findById(id);
    if (!util) {
      return res.status(404).json({ msj: "Útil no encontrado" });
    }
    res.json(util);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

module.exports = router;
const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Utiles = require("../models/utiles.model");

// Ruta POST

router.post("/", async(req, res) => {
    const{nombre, descripcion, cantidad, lista} = req.body;
    if (!nombre || !descripcion || !cantidad){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoUtil = new Utiles({nombre, descripcion, cantidad, lista});
        await nuevoUtil.save()
        res.status(201).json(nuevoUtil);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

// GET: Solicitar datos al servidor (listar útiles)

router.get("/", async (req, res) => {
  try {
    const utiles = await Utiles.find().populate('lista');
    res.json(utiles);  // o res.json({ utiles });
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

//Ruta para visualizar útiles por ID

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

//Ruta para eliminar útiles por ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const resultado = await Utiles.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msj: "No se encontró útil con el ID proporcionado" });
    }

    res.json({ msj: "Útil eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor al eliminar útil", error: error.message });
  }
});

//Ruta para editar útiles por ID

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, cantidad } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const utilActualizado = await Utiles.findByIdAndUpdate(
      id,
      { nombre, descripcion, cantidad },
      { new: true, runValidators: true }
    );

    if (!utilActualizado) {
      return res.status(404).json({ msj: "Útil no encontrado" });
    }

    res.json(utilActualizado);

  } catch (error) {
    console.error('Error al actualizar útil:', error);
    if (error.code === 11000) {
      return res.status(400).json({ msj: "Datos duplicados o mal formados" });
    }
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
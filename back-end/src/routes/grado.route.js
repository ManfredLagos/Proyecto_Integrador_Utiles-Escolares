const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Grado = require("../models/grado.model");

router.post("/", async(req, res) => {
    const{nombre, descripcion, grado} = req.body;
    if (!nombre || !descripcion || !grado){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoGrado = new Grado({nombre, descripcion, grado});
        await nuevoGrado.save()
        res.status(201).json(nuevoGrado);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

router.get("/", async(req, res) => {
    try {
        const grados = await Grado.find();
        res.json(grados);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

//Ruta para visualizar grados por ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const grado = await Grado.findById(id);
    if (!grado) {
      return res.status(404).json({ msj: "Grado no encontrado" });
    }
    res.json(grado);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

//Ruta para eliminar grados por ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const resultado = await Grado.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msj: "No se encontró grado con el ID proporcionado" });
    }

    res.json({ msj: "Grado eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor al eliminar grado", error: error.message });
  }
});

//Ruta para editar grados por ID

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, grado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const gradoActualizado = await Grado.findByIdAndUpdate(
      id,
      { nombre, descripcion, grado },
      { new: true, runValidators: true }
    );

    if (!gradoActualizado) {
      return res.status(404).json({ msj: "Grado no encontrado" });
    }

    res.json(gradoActualizado);

  } catch (error) {
    console.error('Error al actualizar grado:', error);
    if (error.code === 11000) {
      return res.status(400).json({ msj: "Datos duplicados o mal formados" });
    }
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
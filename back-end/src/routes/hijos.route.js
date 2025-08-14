const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Hijos = require("../models/hijos.model");

//Ruta para crear un registro de un hijo
router.post("/", async(req, res) => {
    const{nombre, apellidos, cedula, idPadre, grado} = req.body;
    if (!nombre || !apellidos || !cedula ){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoHijo = new Hijos({nombre, apellidos, cedula, idPadre, grado});
        await nuevoHijo.save()
        res.status(201).json(nuevoHijo);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

//Ruta para mostrar información de los hijos
router.get("/", async(req, res) => {
    try {
        const Hijo = await Hijos.find()
        .populate('grado')
        res.json(Hijo);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

//Ruta para visualizar hijo por ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const hijo = await Hijos.findById(id);
    if (!hijo) {
      return res.status(404).json({ msj: "Hijo no encontrado" });
    }
    res.json(hijo);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

//Ruta para mostrar información de los hijos por idPadre
router.get("/padre/:idPadre", async (req, res) => {
  const idPadre = req.params.idPadre;
  if (!mongoose.Types.ObjectId.isValid(idPadre)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const hijo = await Hijos.find({ idPadre }).populate("grado");
    if (!hijo || hijo.length === 0) {
      return res.status(404).json({ msj: "Hijo no encontrado" });
    }
    res.json(hijo);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

//Ruta para eliminar hijo por ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const resultado = await Hijos.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msj: "No se encontró hijo con el ID proporcionado" });
    }

    res.json({ msj: "Hijo eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor al eliminar hijo", error: error.message });
  }
});

//Ruta para editar hijo por ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidos, cedula, idPadre, grado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const hijoActualizado = await Hijos.findByIdAndUpdate(
      id,
      { nombre, apellidos, cedula, idPadre, grado },
      { new: true, runValidators: true }
    );

    if (!hijoActualizado) {
      return res.status(404).json({ msj: "Hijo no encontrado" });
    }

    res.json(hijoActualizado);

  } catch (error) {
    console.error('Error al actualizar hijo:', error);
    if (error.code === 11000) {
      return res.status(400).json({ msj: "Datos duplicados o mal formados" });
    }
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
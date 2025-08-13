const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Lista_util = require("../models/lista-utiles.model");

router.post("/", async(req, res) => {
    const{nombre, descripcion, idDocente, utiles, grado} = req.body;
    if (!nombre || !descripcion || !idDocente){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoLista = new Lista_util({nombre, descripcion, idDocente, utiles, grado});
        await nuevoLista.save()
        res.status(201).json(nuevoLista);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

router.get("/", async(req, res) => {
    try {
        const lista_utiles = await Lista_util.find()
        .populate('utiles')
        .populate('grado');
        res.json(lista_utiles);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

//Ruta para visualizar útiles por ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    const lista_util = await Lista_util.findById(id);
    if (!lista_util) {
      return res.status(404).json({ msj: "Lista no encontrada" });
    }
    res.json(lista_util);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

//Ruta para visualizar útiles por ID

router.get("/docente/:idDocente", async (req, res) => {
  const idDocente = req.params.idDocente;
  if (!mongoose.Types.ObjectId.isValid(idDocente)) {
    return res.status(400).json({ msj: "ID inválido" });
  }
  try {
    // Buscar todas las listas donde el campo 'docente' sea igual a idDocente
    const listas_utiles = await Lista_util.find({ idDocente: idDocente }).populate("utiles grado");
    
    if (!listas_utiles || listas_utiles.length === 0) {
      return res.status(404).json({ msj: "No se encontraron listas para este docente" });
    }
    res.json(listas_utiles);
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
    const resultado = await Lista_util.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msj: "No se encontró una lista con el ID proporcionado" });
    }

    res.json({ msj: "Lista eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor al eliminar lista", error: error.message });
  }
});

//Ruta para editar útiles por ID

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, utiles, grado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const listaActualizada = await Lista_util.findByIdAndUpdate(
      id,
      { nombre, descripcion, idDocente, utiles, grado },
      { new: true, runValidators: true }
    );

    if (!listaActualizada) {
      return res.status(404).json({ msj: "Útil no encontrado" });
    }

    res.json(listaActualizada);

  } catch (error) {
    console.error('Error al actualizar lista:', error);
    if (error.code === 11000) {
      return res.status(400).json({ msj: "Datos duplicados o mal formados" });
    }
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
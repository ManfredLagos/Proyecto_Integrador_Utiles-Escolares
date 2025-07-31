const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Usuario_mep = require("../models/usuario_mep.model");

// Ruta POST

router.post("/", async(req, res) => {
    const{nombre, apellidos, correo, usuario, contrasenia, rol} = req.body;
    if (!nombre || !apellidos || !correo || !usuario || !contrasenia || !rol){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoUsuario_mep = new Usuario_mep({nombre, apellidos, correo, usuario, contrasenia, rol});
        await nuevoUsuario_mep.save()
        res.status(201).json(nuevoUsuario_mep);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});


// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const usuarios_mep = await Usuario_mep.find();
        res.json(usuarios_mep);
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
    const usuario = await Usuario_mep.findById(id);
    if (!usuario) {
      return res.status(404).json({ msj: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const resultado = await Usuario_mep.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msj: "No se encontró usuario con el ID proporcionado" });
    }

    res.json({ msj: "Usuario eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor al eliminar usuario", error: error.message });
  }
});

module.exports = router;


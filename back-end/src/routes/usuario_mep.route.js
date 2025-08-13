const express = require("express");
const mongoose = require("mongoose"); // IMPORTAR mongoose para validación ObjectId
const router = express.Router();
const Usuario_mep = require("../models/usuario_mep.model");

// Ruta POST

router.post("/", async(req, res) => {
    const{nombre, apellidos, correo, usuario, contrasenia, rol, grado, estado, hijo} = req.body;
    if (!nombre || !apellidos || !correo || !usuario || !contrasenia || !rol){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoUsuario_mep = new Usuario_mep({nombre, apellidos, correo, usuario, contrasenia, rol, grado, estado, hijo});
        await nuevoUsuario_mep.save()
        res.status(201).json(nuevoUsuario_mep);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});


// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const usuarios_mep = await Usuario_mep.find()
        .populate('grado')
        .populate('estado')
        .populate('hijo')
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

router.get("/informacionUsuario/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const usuario = await Usuario_mep.findById(id)
      .populate('lista')
      .populate('grado')
      .populate('estado')
      .populate('hijo');
    if (!usuario) {
      return res.status(404).json({ msj: "Usuario no encontrado" });
    }

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

router.get("/informacionPadre/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const usuario = await Usuario_mep.findById(id)
      .populate('hijo')

    if (!usuario) {
      return res.status(404).json({ msj: "Padre no encontrado" });
    }

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

router.get("/informacionDocente/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msj: "ID inválido" });
  }

  try {
    const usuario = await Usuario_mep.findById(id)
      .populate('grado')
      .populate('lista');

    if (!usuario) {
      return res.status(404).json({ msj: "Docente no encontrado" });
    }

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});

router.post("/iniciar", async (req, res) => {
  const { usuario, contrasenia } = req.body;

  if (!usuario || !contrasenia) {
    return res.status(400).json({ msj: "Usuario y contraseña son obligatorios" });
  }

  try {
    // Buscar usuario y popular campo estado
    const usuarioEncontrado = await Usuario_mep.findOne({ usuario: usuario }).populate('estado');

    if (!usuarioEncontrado) {
      return res.status(401).json({ msj: "Usuario o contraseña incorrectos" });
    }

    if (usuarioEncontrado.contrasenia !== contrasenia) {
      return res.status(401).json({ msj: "Usuario o contraseña incorrectos" });
    }

    const { _id, nombre, apellidos, correo, rol, estado } = usuarioEncontrado;

    res.json({
      msj: "Inicio de sesión exitoso",
      usuario: {
        id: _id,
        nombre,
        apellidos,
        correo,
        usuario,
        rol,
        estado
      }
    });

  } catch (error) {
    res.status(500).json({ msj: "Error en el servidor", error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidos, correo, usuario, rol, grado, estado } = req.body;

  try {
    const usuarioActualizado = await Usuario_mep.findByIdAndUpdate(
      id,
      { nombre, apellidos, correo, usuario, rol, grado, estado },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ msj: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);

  } catch (error) {
    // Manejamos error de clave duplicada con código 11000
    if (error.code === 11000) {
      return res.status(409).json({ msj: "Usuario duplicado" });
    }
    // Otros errores son 400 (bad request)
    res.status(400).json({ msj: "Datos incompletos o mal formados" });
  }
});

module.exports = router;


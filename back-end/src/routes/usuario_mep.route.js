const express = require("express");
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

module.exports = router;

// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const usuarios_mep = await Usuario_mep.find();
        res.json(usuarios_mep);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

module.exports = router;


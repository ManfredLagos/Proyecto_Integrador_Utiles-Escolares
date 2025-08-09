const express = require("express");
const router = express.Router();
const Estados = require("../models/estados.model");

// Ruta POST

router.post("/", async(req, res) => {
    const{nombre, descripcion} = req.body;
    if (!nombre || !descripcion){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoEstado = new Estados({nombre, descripcion});
        await nuevoEstado.save()
        res.status(201).json(nuevoEstad);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

// GET: Solicitar datos al servidor (listar usuarios)
router.get("/", async(req, res) => {
    try {
        const estados = await Estados.find();
        res.json(estados);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

module.exports = router;
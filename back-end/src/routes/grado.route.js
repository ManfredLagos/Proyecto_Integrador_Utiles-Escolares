const express = require("express");
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

module.exports = router;
const express = require("express");
const router = express.Router();
const Lista_util = require("../models/lista-utiles.model");

router.post("/", async(req, res) => {
    const{nombre, descripcion} = req.body;
    if (!nombre || !descripcion){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoLista = new Lista_util({nombre, descripcion});
        await nuevoLista.save()
        res.status(201).json(nuevoLista);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

router.get("/", async(req, res) => {
    try {
        const lista_utiles = await Lista_util.find();
        res.json(lista_utiles);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

module.exports = router;
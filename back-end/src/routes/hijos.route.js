const express = require("express");
const router = express.Router();
const Hijos = require("../models/hijos.model");

router.post("/", async(req, res) => {
    const{nombre, apellidos} = req.body;
    if (!nombre || !apellidos){
        return res.status(400).json({msj: "Todos los campos son obligatorios"});
    }
    try{
        const nuevoHijo = new Hijos({nombre, apellidos});
        await nuevoHijo.save()
        res.status(201).json(nuevoHijo);
    } catch(error){
        res.status(400).json({msj: error.message});
    }
});

router.get("/", async(req, res) => {
    try {
        const Hijo = await Hijos.find();
        res.json(Hijo);
    } catch (error) {
        res.status(500).json({msj: error.message});
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msj: "ID inválido" });
    }
    try {
        const resultado = await Hijos.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
        return res.status(404).json({ msj: "No se encontró usuario con el ID proporcionado" });
        }
        res.json({ msj: "Usuario eliminado correctamente", id: id, registrosEliminados: resultado.deletedCount });
    } catch (error) {
        res.status(500).json({ msj: "Error en el servidor al eliminar usuario", error: error.message });
    }
});

module.exports = router;
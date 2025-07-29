const mongoose = require("mongoose");

const schemaGrado = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    descripcion: {
        type:String,
        required: true,
        unique: false
    },
    grado: {
        type:Number,
        required: true,
        unique: false
    }
});

const Grado = mongoose.model("Grado", schemaGrado);
module.exports = Grado;
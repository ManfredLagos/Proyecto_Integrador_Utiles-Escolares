const mongoose = require("mongoose");

const schemaEstado = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    descripcion: {
        type: String,
        required: true,
        unique: true,
    },
});

const Estados = mongoose.model("Estados", schemaEstado);
module.exports = Estados;
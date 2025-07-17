const mongoose = require("mongoose");

const schemaUsuario_mep = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    apellidos: {
        type:String,
        required: true,
        unique: false
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contrasenia: {
        type: String,
        required: true,
        unique: false
    },
    rol: {
        type: String,
        required:false,
        unique:false
    }
});

const Usuario_mep = mongoose.model("Usuario_mep", schemaUsuario_mep);
module.exports = Usuario_mep;
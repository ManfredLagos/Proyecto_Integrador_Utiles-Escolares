const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
        required:true,
        unique:false
    },
    grado: [
        {
            type: Schema.Types.ObjectId,
            ref:"Grado"
        }
    ],
    estado: [
        {
            type: Schema.Types.ObjectId,
            ref:"Estados"
        }
    ],
    hijo: [
        {
            type: Schema.Types.ObjectId,
            ref:"Hijos"
        }
    ]
});

const Usuario_mep = mongoose.model("Usuario_mep", schemaUsuario_mep);
module.exports = Usuario_mep;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemaLista_utiles = new mongoose.Schema({
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
    utiles: [
        {
            type: Schema.Types.ObjectId,
            ref:"Utiles"
        }
    ],
    grado: [
        {
            type: Schema.Types.ObjectId,
            ref:"Grado"
        }
    ]
});

const Lista_utiles = mongoose.model("Lista_utiles", schemaLista_utiles);
module.exports = Lista_utiles;
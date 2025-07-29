const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemaUtiles = new mongoose.Schema({
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
    cantidad: {
        type: Number,
        required: true,
        unique: false
    },
    lista: [
        {
            type: Schema.Types.ObjectId,
            ref:"Lista"
        }
    ]
});

const Utiles = mongoose.model("Utiles", schemaUtiles);
module.exports = Utiles;
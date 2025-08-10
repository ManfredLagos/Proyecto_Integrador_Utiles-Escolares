const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemaHijos = new mongoose.Schema({
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
    grado: [
        {
            type: Schema.Types.ObjectId,
            ref:"Grado"
        }
    ],
});

const Hijos = mongoose.model("Hijos", schemaHijos);
module.exports = Hijos;
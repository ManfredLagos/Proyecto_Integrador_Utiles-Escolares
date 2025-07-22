const express = require("express");
const router = express.Router();
const controller = require("../controllers/contacto.controller");

router.get("/Contacto", controller.index);

module.exports = router;
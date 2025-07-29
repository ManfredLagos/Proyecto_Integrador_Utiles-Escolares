const express = require("express");
const router = express.Router();
const controller = require("../controllers/sobreNosotros.controller");

router.get("/", controller.index);

module.exports = router;
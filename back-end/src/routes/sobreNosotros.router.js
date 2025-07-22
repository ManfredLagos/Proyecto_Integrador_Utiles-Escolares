const express = require("express");
const router = express.Router();
const controller = require("../controllers/sobreNosotros.controller");

router.get("/SobreNosotros", controller.index);

module.exports = router;
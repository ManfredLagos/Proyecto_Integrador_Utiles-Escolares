const express = require("express");
const router = express.Router();
const controller = require("../controllers/iniciar.controller");

router.get("/iniciar", controller.index);

module.exports = router;

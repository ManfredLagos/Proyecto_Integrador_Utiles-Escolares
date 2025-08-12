const express = require("express");
const router = express.Router();

const controller = require("../controllers/main.controller");

router.get("/", controller.index);
router.get("/administrador-dashboard", controller.administradorDashboard);
router.get("/administrador-dashboard-usuarios", controller.administradorDashboardUsuarios);
router.get("/administrador-dashboard-grados", controller.administradorDashboardGrados);
router.get("/administrador-dashboard-utiles", controller.administradorDashboardUtiles);
router.get("/administrador-dashboard-listas", controller.administradorDashboardListas);
router.get("/administrador-dashboard-reportes", controller.administradorDashboardReportes);
router.get("/administrador-dashboard-configuracion", controller.administradorDashboardConfiguracion);
router.get("/docente-dashboard", controller.docenteDashboard);
router.get("/docente-dashboard-usuarios", controller.docenteDashboardUsuarios);
router.get("/docente-dashboard-grados", controller.docenteDashboardGrados);
router.get("/docente-dashboard-utiles", controller.docenteDashboardUtiles);
router.get("/docente-dashboard-listas", controller.docenteDashboardListas);
router.get("/docente-dashboard-reportes", controller.docenteDashboardReportes);
router.get("/docente-dashboard-configuracion", controller.docenteDashboardConfiguracion);
router.get("/padre-dashboard", controller.padreDashboard);
router.get("/padre-dashboard-hijos", controller.padreDashboardHijos);
router.get("/padre-dashboard-grados", controller.padreDashboardGrados);
router.get("/padre-dashboard-utiles", controller.padreDashboardUtiles);
router.get("/padre-dashboard-listas", controller.padreDashboardListas);
router.get("/padre-dashboard-reportes", controller.padreDashboardReportes);
router.get("/padre-dashboard-configuracion", controller.padreDashboardConfiguracion);

module.exports = router;
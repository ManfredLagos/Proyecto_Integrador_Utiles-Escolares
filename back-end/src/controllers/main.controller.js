const path = require("path");

const index = (req, res) => {
    res.render("index");
};

const administradorDashboard = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-inicio.html"));
};

const administradorDashboardUsuarios = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-usuario.html"));
};

const administradorDashboardGrados = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-grados.html"));
};

const administradorDashboardUtiles = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-utiles.html"));
};

const administradorDashboardListas = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-listas.html"));
};

const administradorDashboardReportes = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-reportes.html"));
};

const administradorDashboardConfiguracion = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/administrador-dashboard-configuracion.html"));
};

const docenteDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../../private/docente-dashboard-inicio.html"));
};

const docenteDashboardUsuarios = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-usuario.html"));
};

const docenteDashboardGrados = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-grados.html"));
};

const docenteDashboardUtiles = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-utiles.html"));
};

const docenteDashboardListas = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-listas.html"));
};

const docenteDashboardReportes = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-reportes.html"));
};

const docenteDashboardConfiguracion = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/docente-dashboard-configuracion.html"));
};

const padreDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../../private/padre-dashboard-inicio.html"));
};

const padreDashboardUsuarios = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-usuario.html"));
};

const padreDashboardGrados = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-grados.html"));
};

const padreDashboardUtiles = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-utiles.html"));
};

const padreDashboardListas = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-listas.html"));
};

const padreDashboardReportes = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-reportes.html"));
};

const padreDashboardConfiguracion = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../private/padre-dashboard-configuracion.html"));
};

module.exports = {
    index,
    administradorDashboard,
    administradorDashboardUsuarios,
    administradorDashboardGrados,
    administradorDashboardUtiles,
    administradorDashboardListas,
    administradorDashboardReportes,
    administradorDashboardConfiguracion,
    docenteDashboard,
    docenteDashboardUsuarios,
    docenteDashboardGrados,
    docenteDashboardUtiles,
    docenteDashboardListas,
    docenteDashboardReportes,
    docenteDashboardConfiguracion,
    padreDashboard,
    padreDashboardUsuarios,
    padreDashboardGrados,
    padreDashboardUtiles,
    padreDashboardListas,
    padreDashboardReportes,
    padreDashboardConfiguracion,
};
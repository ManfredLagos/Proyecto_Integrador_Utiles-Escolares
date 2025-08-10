//Dependencias, son bibliotecas que se instalan para que el servidor pueda levantarse correctamente
const express = require('express'); //Facilita la creaciÃ³n de servidores y manejo de rutas
const mongoose = require('mongoose'); //Permite conectarse a la BD de mongoDB y crear las colecciones y realizar consultas
const cors = require('cors'); //Permite la comunicaciÃ³n entre dominios diferentes
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la peticiÃ³n en formto json
const layouts = require("express-ejs-layouts");

require('dotenv').config(); //Se importa el archivo .env para poder utilizar sus variables dentro del cÃ³digo

const app = express(); //Crear una instancia de express
const PORT = process.env.PORT || 3000; //Usar el puerto indicado en .env o si no se indica usar el puerto 3000
const path = require('path');

//importar rutas
const usuario_mepRoute = require("./src/routes/usuario_mep.route")
const utilesRoute = require("./src/routes/utiles.route")
const lista_utilesRoute = require("./src/routes/lista-utiles.route")
const gradoRoute = require("./src/routes/grado.route")
const estadoRoute = require("./src/routes/estados.route")
const hijosRoute = require("./src/routes/hijos.route")

app.use(express.json());//Habilita el manejo de JSON en las peticiones
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//Habilita el anÃ¡lisis de JSON en las peticiones 
app.use(cors());
app.use(layouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('Ocurrió un error al conectarse con MongoDB: ', error));

//rutas
app.use("/usuario_mep", usuario_mepRoute);
app.use("/utiles", utilesRoute);
app.use("/lista-utiles", lista_utilesRoute);
app.use("/grado", gradoRoute);
app.use("/estado", estadoRoute);
app.use("/hijos", hijosRoute);

const mainRouter = require("./src/routes/main.route");
app.use(mainRouter);

app.use("/iniciar", require("./src/routes/iniciar.route"));
app.use("/contacto", require("./src/routes/contacto.route"));
app.use("/sobreNosotros", require("./src/routes/sobreNosotros.route"));

app.listen(PORT, ()=>{
    console.log('Servidor corriendo en http://localhost:' + PORT);
});
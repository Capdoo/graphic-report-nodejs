const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
//const MySql = require('express-mysql-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const pasport = require('passport');
const passport = require('passport');
const multer = require('multer');
const csv = require('csv-parser');
const csvtojson = require('csvtojson');
//const morris = require('morris-js-module');

//Inicializar
const app = express();
require('./lib/passport');
require('./lib/jquery');
//require('./views/ploteos/engine');

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Middlewares
app.use(session({
    secret: 'misession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas del sitio
app.use(require('./routes/routes.js'));
app.use(require('./routes/authentication.js'));

app.use(require('./routes/datasets.js'));
app.use(require('./routes/graficas.js'));
app.use(require('./routes/ploteos.js'));

app.use('/links', require('./routes/links.js'));
app.use('/datasets', require('./routes/datasets.js'));
app.use('/graficas', require('./routes/graficas.js'));
app.use('/ploteos', require('./routes/ploteos.js'));
// app.use('/routes', require('./routes/routes.js'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Comenzar el Servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
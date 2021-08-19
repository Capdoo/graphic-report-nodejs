const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const mimeTypes = require('mime-types');


const storage = multer.diskStorage({
    destination: 'src/public/datasets/',
    filename: function(req,file,cb){
        //Funcion mas completa
        // cb("",Date.now()+file.originalname+"."+mimeTypes.extension(file.mimetype))
        cb("",Date.now()+file.originalname)
    }
})
//Definicio comun
// const upload = multer({dest:'src/public/datasets/'});
//Definimos el upload, con storage
const upload = multer({storage:storage});

module.exports = upload;

//Para mostrar el formulario
router.get('/cargar', isLoggedIn,(req,res) => {
    res.render('datasets/cargar');
    // res.render('datasets/cargar');
});

//Para recibir el formulario
router.post('/subir',upload.single('avatar'),isLoggedIn, async (req, res) => {
    res.send('Todo bien!');

});

module.exports = router;


//2:43:29


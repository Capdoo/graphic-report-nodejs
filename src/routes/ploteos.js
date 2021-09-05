const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs');
const {isLoggedIn} = require('../lib/auth');
const csv = require('csv-parser');

const csvtojson = require('csvtojson');



//GET-PRINCIPAL GRAFICAS
router.get('/ploteos', isLoggedIn,async (req, res) => {
    const graficas = await pool.query('SELECT * FROM GRAFICAS');
    console.log(graficas);

    


    console.log("el tipo nombre",tipo_nombre);


    res.render('ploteos/plotear-grafica', { graficas: graficas });
})








module.exports = router;


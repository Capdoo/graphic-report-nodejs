const express = require('express');
const router = express.Router();
const pool = require('../database');
const fs = require('fs');
const {isLoggedIn} = require('../lib/auth');
const csv = require('csv-parser');

const csvtojson = require('csvtojson');

let real;
let gLabel = [];
let gValues = [];
let tipo;


//GET-AGREGAR GRAFICA
router.get('/agregar',isLoggedIn, (req, res) => {
    res.render('graficas/agregar-graficas');
});

//POST-AGREGAR GRAFICA
router.post('/agregar',isLoggedIn, async (req, res) => {
    const { nombre, tipo, super_descripcion, descripcion } = req.body;
    const newGrafica = {
        NOMBRE : nombre,
        TIPO_ID : tipo,
        SUPER_DESCRIPCION : super_descripcion,
        DESCRIPCION : descripcion
    };

    await pool.query('INSERT INTO GRAFICAS set ?', [newGrafica]);

    console.log(newGrafica);
    console.log(req.body);
    req.flash('success', 'Elemento guardado correctamente');
    res.redirect('/graficas');
});

//GET-PRINCIPAL GRAFICAS
router.get('/', isLoggedIn,async (req, res) => {
    const graficas = await pool.query('SELECT * FROM GRAFICAS');
    console.log(graficas);
    res.render('graficas/listar-graficas', { graficas: graficas });
})

//GET-ELIMINAR GRAFICA
router.get('/delete/:ID', isLoggedIn,async (req, res) => {
    const { ID } = req.params;
    const dataset_id =  await pool.query('SELECT * FROM GRAFICAS WHERE ID = ?', [ID])
    console.log("Mi dataset id de grafica ",dataset_id);

    let target = dataset_id[0].DATASET_ID;
    console.log("El objetivo es ",target);

    pool.query('DELETE FROM DATASETS WHERE ID = ?', target)
    pool.query('DELETE FROM GRAFICAS WHERE ID = ?', [ID])

    req.flash('success', 'Grafica eliminada');
    res.redirect('/graficas');

    console.log(req.params.ID);
});

//GET-EDITAR GRAFICA
router.get('/edit/:ID',isLoggedIn, async (req, res) => {
    const { ID } = req.params;
    console.log("Esta es la g a editar",[ID]);
    const graficas = await pool.query('SELECT * FROM GRAFICAS WHERE ID = ?', [ID]);
    res.render('graficas/editar-graficas', { grafica: graficas[0] })
    console.log("Esta es la g a editar",graficas[0]);
});

//POST-EDITAR GRAFICA
router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { nombre, super_descripcion, descripcion } = req.body;
    const newGrafica = {
        NOMBRE : nombre,
        SUPER_DESCRIPCION : super_descripcion,
        DESCRIPCION : descripcion
    };
    console.log(newGrafica);
    await pool.query('UPDATE GRAFICAS SET ? WHERE id = ?', [newGrafica, id]);
    req.flash('success', 'Grafica editada');
    res.redirect('/graficas');
});

//POST-IMPORTAR DATASET
router.post('/importar/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const {id_dataset} = req.body;

    //console.log(newGrafica);
    await pool.query('UPDATE GRAFICAS SET DATASET_ID = ? WHERE ID = ?', [id_dataset, id]);
    req.flash('success', 'Grafica actualizada con dataset');
    res.redirect('/graficas');
});

//GET-MOSTRAR GRAFICA VISTA PREVIA
router.get('/mostrar/:ID',isLoggedIn, async(req, res) => {
    console.log('HEY')
    const { ID } = req.params;
    const graficas = await pool.query('SELECT * FROM GRAFICAS WHERE ID = ?', [ID]);

    let tipo_nombre;
    switch(graficas[0].TIPO_ID){
        case 1:
            tipo_nombre = "Barras";
            break;
        case 2:
            tipo_nombre = "Pie";
            break;
        case 3:
            tipo_nombre = "Lineas";
            break;
        case 4:
            tipo_nombre = "Puntos";
            break;
    }

    const datasets = await pool.query('SELECT * FROM DATASETS');
    console.log('MIS DATASETS', datasets)
    res.render('graficas/mostrar-graficas', { grafica: graficas[0] , datasets : datasets, tipo_nombre})
});

//POST-PLOTEAR GRAFICA EN LA MISMA PESTAÑA
router.post('/plotear/:id', isLoggedIn,async (req, res) => {
    
    const { id } = req.params;
    const {tipo_nombre,tipo_grafica_id, dataset_id} = req.body;

    const dataset_nombre = await pool.query('SELECT NOMBRE_FILE FROM DATASETS WHERE ID = ?',dataset_id);


    //Definir la grafica
    const tipo_grafica = tipo_grafica_id;
    console.log("Este es mi tipo de grafica", tipo_grafica);

    tipo = tipo_grafica;

    //Enviar JSONS
    let labels =[];
    let values = [];

    console.log("antes switch")
    switch(tipo_grafica){
        
        case '1':
            labels = []
            values = []
            console.log("switch case 1")
            csvtojson().fromFile("./src/public/datasets/"+dataset_nombre[0].NOMBRE_FILE).then(source => {
                console.log("Estos son los datos a enviar: ");
                console.log(source);
    
                console.log(source.length);
        
                for (x of source){
                    labels.push(x.medicamento)
                    values.push(x.numero)
                }
        
                nroBarras = source.length;;
                enviarData(labels,values,source);
            });
            break;
        case '2':
            console.log("switch case 2")
            labels = []
            values = []
            csvtojson().fromFile("./src/public/datasets/"+dataset_nombre[0].NOMBRE_FILE).then(source => {
                console.log("Estos son los datos a enviar: ");
                console.log(source);
    
                console.log(source.length);
        
                // // for (x of source){
                //     labels.push(x.hsueno)
                //     values.push(x.cantidad)
                // }
        
                nroBarras = source.length;;
                enviarData(labels,values,source);
            });
            break;

        case '3':

        case '4':
        
    }

    function enviarData(a,b,c){
        gLabel = a;
        gValues = b;
        real = c;
    }

    //PRIMERO REVISAR LA DATA :)
    res.render('ploteos/plotear-grafica')
});

router.get('/send',gLabel,async (req, res) => {
    console.log("Enviando el array de objetos")
    res.send(real);
});

router.get('/tipo-grafica',gLabel,async (req, res) => {
    console.log("Enviando el tipo de grafica", tipo)
    res.send(tipo);
});

module.exports = router, gValues, gLabel;
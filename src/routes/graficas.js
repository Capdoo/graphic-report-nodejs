const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/agregar',isLoggedIn, (req, res) => {
    res.render('graficas/agregar-graficas');
});

router.post('/agregar',isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newGrafica = {
        title,
        url,
        description
    };

    await pool.query('INSERT INTO links set ?', [newGrafica]);

    console.log(newGrafica);
    console.log(req.body);
    req.flash('success', 'Elemento guardado correctamente');
    res.redirect('/graficas');
});

router.get('/', isLoggedIn,async (req, res) => {
    const graficas = await pool.query('SELECT * FROM links');
    console.log(graficas);
    res.render('graficas/listar-graficas', { graficas: graficas });
})




router.get('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    req.flash('success', 'Grafica eliminado');
    res.redirect('/graficas');

    console.log(req.params.id);
    res.send('Eliminado');
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const graficas = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('graficas/editar-graficas', { grafica: graficas[0] })
    console.log(graficas[0]);

    // await pool.query('DELETE FROM links WHERE ID = ?', [id])
    // res.redirect('/links');

    // console.log(req.params.id);
    // res.send('Eliminado');
});



router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newGrafica = {
        title,
        description,
        url
    };
    console.log(newGrafica);
    await pool.query('UPDATE links SET ? WHERE id = ?', [newGrafica, id]);
    req.flash('success', 'Grafica editada');
    res.redirect('/graficas');
});

//Para ver la grafica
router.get('/mostrar/:id',isLoggedIn, async(req, res) => {
    console.log('HEY')
    const { id } = req.params;
    const graficas = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('graficas/mostrar-graficas', { grafica: graficas[0] })
    // res.render('links/mostrar');
});



module.exports = router;


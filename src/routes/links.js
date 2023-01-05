const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('INSERT INTO links set ?', [newLink]);

    console.log(newLink);
    console.log(req.body);
    req.flash('success', 'Elemento guardado correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn,async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    res.render('links/list', { links: links });
})


router.get('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    req.flash('success', 'Elemento eliminado');
    res.redirect('/links');

    console.log(req.params.id);
    res.send('Eliminado');
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0] })
    console.log(links[0]);

    // await pool.query('DELETE FROM links WHERE ID = ?', [id])
    // res.redirect('/links');

    // console.log(req.params.id);
    // res.send('Eliminado');
});

router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newlink = {
        title,
        description,
        url
    };
    console.log(newlink);
    await pool.query('UPDATE links SET ? WHERE id = ?', [newlink, id]);
    req.flash('success', 'Elemento editado');
    res.redirect('/links');
});

//Para ver la grafica
router.get('/mostrar/:id',isLoggedIn, async(req, res) => {
    console.log('HEY')
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/mostrar', { link: links[0] })
    // res.render('links/mostrar');
});

module.exports = router;


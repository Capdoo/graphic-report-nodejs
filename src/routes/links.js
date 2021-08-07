const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req,res)=>{
    res.render('links/add');
});

router.post('/add', async(req,res)=>{
    const {title, url, description} =req.body;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('INSERT INTO links set ?', [newLink]);

    console.log(newLink);
    console.log(req.body);
    req.flash('success','Elemento guardado correctamente');
    res.redirect('/links');
});

router.get('/', async(req,res)=>{
    const links = await pool.query('SELECT * FROM links');
    console.log(links);
    res.render('links/list',{links: links});
})


router.get('/delete/:id', async(req,res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    res.redirect('/links');

    console.log(req.params.id);
    res.send('Eliminado');
});

router.get('/edit/:id', async(req,res) => {
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?',[id]);
    res.render('links/edit',{link : links[0]})
    console.log(links[0]);
    // await pool.query('DELETE FROM links WHERE ID = ?', [id])
    // res.redirect('/links');

    // console.log(req.params.id);
    // res.send('Eliminado');
});



router.post('/edit/:id', async(req,res) => {
    const {id} = req.params;
    const {title, description, url} = req.body;
    const newlink = {
        title,
        description,
        url
    };
    console.log(newlink);
    await pool.query('UPDATE links SET ? WHERE id = ?', [newlink,id]);
    res.redirect('/links');
});


module.exports = router;


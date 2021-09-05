const express = require('express');
const router = express.Router();
const {real} = require('./graficas')


router.get('/',(req,res)=>{
    res.render('main/index');
    //res.send('Hello World');
});

// router.get('/send',real, async(req,res) => {
//     console.log('Revisando real desde root', real)
//     console.log('Enviado a root');
// });


module.exports = router;
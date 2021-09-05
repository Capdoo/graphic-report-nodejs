const express = require('express');
const router = express.Router();
const passport = require('passport');

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

//Para mostrar el formulario
router.get('/signup', isNotLoggedIn,(req,res) => {
    res.render('auth/signup');
});

//Para recibir el formulario
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup',{

    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//LOGIN
router.get('/signin', isNotLoggedIn, (req,res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn,(req,res,next) => {

    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

//Se agrega isLoggedIn para proteger la ruta, se ejecuta primero eso
router.get('/profile', isLoggedIn,(req,res) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn,(req,res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;


//2:43:29
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

//LOGIN
passport.use('local.signin', new LocalStrategy({
    usernameField: 'USERNAME',
    passwordField: 'PASSWORD',
    passReqToCallback: true
    
}, async(req, USERNAME, PASSWORD, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM USUARIOS WHERE USERNAME = ?', [USERNAME]);
    console.log("Aqui va el resultado",rows);
    if(rows.length > 0){
        const user = rows[0];
        console.log(user);
        //Validar su contrase;a

        const validPassword = await helpers.matchPassword(PASSWORD, user.PASSWORD);
        console.log("Este es valid password",validPassword);
        console.log("Este es users ",user);
        if(validPassword){
            done(null, user, req.flash('success','Welcome ' + user.USERNAME));
        }else{
            done(null, false, req.flash('message','Contrasena incorrecta'));
        }
    } else{
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));


//SIGN UP
passport.use('local.signup', new LocalStrategy({
    
    usernameField: 'USERNAME',
    passwordField: 'PASSWORD',
    passReqToCallback : true

}, async(req, USERNAME, PASSWORD, done) => {
    console.log('Ingreso')
    const {FIRST_NAME, LAST_NAME, EMAIL} = req.body; /*USERNAME, PASSWORD,FIRST_NAME,LAST_NAME,EMAIL */
    const newUser = {
        USERNAME,
        PASSWORD,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
        // fullname
    };
    console.log(req.body);
    newUser.PASSWORD = await helpers.encryptPassword(PASSWORD)
    const result = await pool.query('INSERT INTO USUARIOS SET ?', [newUser]);
    newUser.id = result.insertId;
    console.log(result);

    //NUll no error, newUser para nueva sesion
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.ID);

});

passport.deserializeUser( async(id, done) => {
    const filas = await pool.query('SELECT * FROM USUARIOS WHERE ID = ?', [id]);
    done(null, filas[0]);
});
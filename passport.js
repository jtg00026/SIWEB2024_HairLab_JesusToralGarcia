const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./models/usuarios');
passport.use(new LocalStrategy({
    usernameField: 'email', // Campo del formulario para el email
    passwordField: 'password' // Campo del formulario para la contraseña
}, async (email, password, done) => {
    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            console.log('Usuario no encontrado');
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const contraseñaValida = await usuario.validarContrasena(password);

        if (!contraseñaValida) {
            console.log('Contraseña incorrecta');
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        console.log('Usuario autenticado correctamente');
        return done(null, usuario);
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        return done(error);
    }
}));


passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findById(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;

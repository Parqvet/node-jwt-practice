const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// routes
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Nodejs and JWT'
    });
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        name: 'Henry',
        email: 'henry@gmail.com'
    };
    // cuando un usuario entra a su cuenta, un nuevo token debe ser creado
    // con esto jwt va a crear un token y asi poder identificar al usuario
    // dicho token es enviado al cliente, y el navegador va a guardar el mismo
    // se puede almacernar el token en localStorage o alguna cookie
    // para que expire el token, le pasamos otro parametro como objeto al metodo sigin con la propiedad expiresIn
    jwt.sign({user}, 'secretkey', {expiresIn: '32s'}, (err, token) => {
        res.json({
            token
        })
    });

});

// al tratar de acceder a esta ruta, se ejecutara la funcion verifyToken
// la cual se encarga de verificar si el usuario esta enviando un token
app.post('/api/posts', verifyToken, (req, res) => {
    // hacer que el usuario pueda acceder a esta ruta siempre y cuando tenga un token
    // desde el lado del servidor verificamos si el token es valido o no

    // otra manera de hacer esto, sin utlizar jwt, seria que el servidor cree y almacene un session id
    // pero usando jwt ninguna informacion es guuardada del lado del servidor

    // verificamos que el token sea valido
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: 'Post fue creado',
                authData
            });
        }
    })
});

// funcion que se encarga de verificar si dicho token fue enviado por el usuario
// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    // para poder tener acceso al token, informacion que lo estamos obteniendo del lado del cliente
    const bearerHeader = req.headers['authorization'];

    // luego verificamos si dicho token existe
    if (typeof bearerHeader !== 'undefined') {
        // para tener acceso directo al token
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        // en caso de que el token sea invalido respondemos con acceso denegado
        res.sendStatus(403);
    }
};

// starting the server
app.listen(3000, () => {
    console.log('Server on port', 3000);
})

/* tutorial practico del canal de youtube de CodigoMentor */
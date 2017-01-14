/**
 * Created by michaelmatias on 1/14/17.
 */


const jwt = require('express-jwt');

exports.authCheckMiddlware = jwt({
    secret: new Buffer(config.auth.auth0.secretKey),
    audience: config.auth.auth0.clientId
});

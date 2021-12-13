const axios = require('axios');
const cognito = require('../config/aws-config.json').cognito;
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const BaseResponse = require('../utilities/response');
module.exports = (req, res, next) => {

    if (req.header('Authorization')) {
        const token = req.header('Authorization').split(' ')[1];
        axios.get(`https://cognito-idp.${cognito.region}.amazonaws.com/${cognito.userPoolId}/.well-known/jwks.json`)
            .then(data => {
                if (data) {
                    pems = {};
                    var keys = data.data['keys'];
                    for (var i = 0; i < keys.length; i++) {
                        var key_id = keys[i].kid;
                        var modulus = keys[i].n;
                        var exponent = keys[i].e;
                        var key_type = keys[i].kty;
                        var jwk = { kty: key_type, n: modulus, e: exponent };
                        var pem = jwkToPem(jwk);
                        pems[key_id] = pem;
                    }
                    var decodedJwt = jwt.decode(token, { complete: true });
                    if (!decodedJwt) {
                        console.log("Not a valid JWT token");
                        res.status(401);
                        return res.send("Invalid token");
                    }
                    var kid = decodedJwt.header.kid;
                    var pem = pems[kid];
                    if (!pem) {
                        res.status(401);
                        return res.send("Invalid token");
                    }
                    jwt.verify(token, pem, function (err, payload) {
                        if (err) {
                            res.status(401);
                            return res.send("Invalid token");
                        } else {
                            req.userInfo = payload;
                            return next();
                        }
                    });
                }
            })
            .catch(err => {
                res.status(400);
                return res.send('Error! Unable to download JWKs', err);
            });
    } else {
        return res.status(401).json(BaseResponse.sendError('Unauthorized!'));
    }
};
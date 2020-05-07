const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Create a new Express app
const app = express();

// Set up Auth0 configuration
const authConfig = {
  domain: "tracker-dev.eu.auth0.com",
  audience: "my-api"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from tracker-dev.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

var jwtAdminCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://tracker-dev.eu.auth0.com/.well-known/jwks.json'
}),
aud:'admin-stuff',
issuer: 'https://tracker-dev.eu.auth0.com/',
algorithms: ['RS256']
});


// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});

app.get("/api/authorized", jwtAdminCheck, (req, res) => {
  res.send({
    msg: "Secured Resource!"
  });
});

/*
app.use(jwtAdminCheck);

app.get('/authorized', function (req, res) {
res.send('Secured Resource');
});

*/

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
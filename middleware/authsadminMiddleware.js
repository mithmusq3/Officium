const jwt = require('jsonwebtoken');

const requiresuperAuth = (req, res, next) => {
  const token = req.cookies.jwtsadmin;

//   check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/sadmin'); 
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/sadmin');
  }
};

module.exports = { requiresuperAuth };
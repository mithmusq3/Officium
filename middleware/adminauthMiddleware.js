const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const requireadminAuth = (req, res, next) => {
  const token = req.cookies.jwtadmin;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/admin'); 
      } else {
        // console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/admin');
  }
};


// check current admin
const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwtadmin;
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let admin = await Admin.findById(decodedToken.id);
        res.locals.admin = admin;
        next();
      }
    });
  } else {
    res.locals.admin = null;
    next();
  }
};

module.exports = { requireadminAuth , checkAdmin };
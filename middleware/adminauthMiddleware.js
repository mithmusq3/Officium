const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();


const requireadminAuth = (req, res, next) => {
  const token = req.cookies.jwtadmin;
  const stoken = req.cookies.jwtsadmin;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/admin'); 
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else if(stoken){
    jwt.verify(stoken, 'WingardiumLeviosa', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/sadmin'); 
      } else {
        console.log(decodedToken);
        next();
      }
    });
  }else{
    res.redirect('/sadmin');
  }
};


const requireAuthId = (req, res, next) => {
  const token = req.cookies.jwtadmin;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/dashboard'); 
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/dashboard');
  }
};

// check current admin
const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwtadmin;
  const stoken = req.cookies.jwtsadmin;

  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let admin = await Admin.findById(decodedToken.id);
        res.locals.admin = admin;
        res.locals.checkvalue=0;
        next();
      }
    });
  } else if (stoken) {
    jwt.verify(stoken, 'WingardiumLeviosa', async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let admin = await Admin.findById(decodedToken.id);
        res.locals.admin = admin;
        res.locals.checkvalue=0;
        next();
      }
    });
  } else {
    res.locals.admin = null;
    next();
  }
};

module.exports = { requireAuthId, requireadminAuth , checkAdmin };
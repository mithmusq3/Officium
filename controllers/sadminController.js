const User = require('../models/User');
const Admin = require('../models/Admin');
const Offer = require('../models/Offer');
const Relation = require('../models/Relation');
const jwt = require('jsonwebtoken');
// const Resume = require('../models/Resume');
require('dotenv').config();



const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, 'WingardiumLeviosa', {
    expiresIn: maxAge
  });
}




// Super Admin
module.exports.sadmin_get = async (req, res) => {
  try {
    const useroffer = await User.aggregate(
      [
        {
          $group:
          {
            _id: null,
            totaloffer: { $sum: "$no_offer" },
          }
        }
      ]
    );
    const usercount =await User.aggregate(
      [
        {
          $group:
          {
            _id: null,
            count: { $sum: 1 },
          }
        }
      ]
    );
    const admincount =await Admin.aggregate(
      [
        {
          $group:
          {
            _id: null,
            count: { $sum: 1 },
          }
        }
      ]
    );
    const offercount =await Offer.aggregate(
      [
        {
          $group:
          {
            _id: null,
            count: { $sum: 1 },
          }
        }
      ]
    );

    console.log(process.env.SADMIN_PWD);
    res.render('sadmindash', { offercount:offercount,useroffer: useroffer, title: 'Super Admin',usercount:usercount,admincount:admincount });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }



}

module.exports.sadmin_login_get = (req, res) => {
  res.render('sadmin', { tittle: 'Super Admin Login' });
}


// List of Users Page Get
module.exports.listuser_get = async (req, res) => {
  try {
    const users = await User.find();
    // const admins = await Admin.find();
    // users:users,admins:admins


    res.render('listuser', { users: users, title: 'Super Admin' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }

}
module.exports.listadmin_get = async (req, res) => {
  try {
    const offercounts = await Offer.aggregate(
      [
        {
          $group:
          {
            _id: "$adminid",
            count: { $sum: 1 },
          }
        }
      ]
    );
    const applycounts = await Relation.aggregate(
      [
        {
          $group:
          {
            _id: "$postadminid",
            count: { $sum: 1 },
          }
        }
      ]
    );
    const admins = await Admin.find();
    res.render('listadmin', { admins: admins, title: 'Super Admin', offercounts: offercounts, applycounts: applycounts });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }

}


// List of Companies Page Get
module.exports.listcompany_get = async (req, res) => {
  try {
    const offergroup = await Offer.aggregate(
      [
        {
          $group:
          {
            _id: "$company",
            count: { $sum: 1 },
          }
        }
      ]
    );

    res.render('listcompany', { title: 'Super Admin', offergroup: offergroup });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }

}

// List of Companies Page Get
module.exports.company_get = async (req, res) => {
  try {

    const id = req.params.id;
    const name = id;
    const companydatas = await Offer.find({ company: id });
    res.render('companydesc', { title: 'Super Admin', companydatas: companydatas, name: name });


  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }

}


module.exports.sadmin_login_post = (req, res) => {
  const { username, password } = req.body;
  var routestat = false;

  try {
    // if(username == )
    // res.render('sadmin',{tittle:'Super Admin Login'}); 



    if (username == process.env.SADMIN_USER && password == process.env.SADMIN_PWD) {
      routestat = true;
      const token = createToken(process.env.SADMIN_ID);
      res.cookie('jwtsadmin', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ routestat });
    } else {
      res.status(400).json({ routestat });
    }

  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}



module.exports.sadmin_logout_get = async (req, res) => {
  res.cookie('jwtsadmin', '', { maxAge: 1 });
  res.redirect('/sadmin');
}
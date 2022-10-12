const User = require('../models/User');
const Admin = require('../models/Admin');
const Offer = require('../models/Offer');
const Relation = require('../models/Relation');
const Resume = require('../models/Resume');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer')
const momentjs = require('moment');

// GET FUNCTIONS


// User functions 

//User Dashboard get function
module.exports.dashboard_get = (req, res) => {
  Offer.find().sort({ createdAt: -1 })
    .then(result => {
      Resume.find().sort({ createdAt: -1 }).then(
        resume => {
          Relation.find().sort({ createdAt: -1 }).then(relations => {
            res.render('dashboard', { offers: result, resumes: resume, tittle: 'Dashboard', relations: relations });
          }).catch(err => {
            console.log(err);
          });
        }
      ).catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
}



//Admin Dashboard get function
module.exports.adminpage_get = (req, res) => {

  Offer.find().sort({ createdAt: -1 })
    .then(result => {
      Relation.find().sort({ createdAt: -1 })
        .then(relations => {
          res.render('adminpage', { relations: relations, offers: result, title: 'Admin Dashboard' });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

}

//Description of JOB in User get function
module.exports.descrip_get = (req, res) => {
  const id = req.params.id;
  Offer.findById(id)
    .then(result => {
      const adminid = result.adminid;
      Admin.findById(adminid).then(postadmin => {

        res.render('descrip', { offer: result, title: 'Description', postadmin: postadmin });
      }).catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}


//Admin function

// Create new offer 
module.exports.newoffer_get = (req, res) => {
  res.render('newoffer', { tittle: 'New Offer' });
}


//POST FUNCTION

// Admin function to create a new offer 


module.exports.newoffer_post = async (req, res) => {
  const { company, tittle, type, description } = req.body;
  // console.log( tittle,  type, description);

  const token = req.cookies.jwtadmin;
  if (token) {
    jwt.verify(token, 'WingardiumLeviosa', async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        const admin = await Admin.findById(decodedToken.id);
        try {
          const adminid = admin._id;
          const offer = await Offer.create({ company, tittle, type, description, adminid });
          res.status(201).json({ offer: offer._id });

        }
        catch (err) {
          console.log(err);
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
      }
    });
  }

}

// Delete descrip 

module.exports.descrip_delete = async (req, res) => {
  const id = req.params.id;
  Offer.findByIdAndDelete(id)
    .then(result => {
      Relation.deleteMany({ offerid: id }).then(response => {
        res.json({ redirect: '/adminpage' });
      }).catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

// User description 

module.exports.userdescrip_get = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Offer.findById(id)
    .then(result => {
      const adminid = result.adminid;
      const value = 0;
      Admin.findById(adminid).then(postadmin => {
        Relation.find().sort({ createdAt: -1 })
          .then(relations => {
            res.render('userdescrip', { value: value, offer: result, relations: relations, title: 'Description', postadmin: postadmin });
          })
          .catch(err => {
            console.log(err);
          });
      }).catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}


// User Description POST 



module.exports.userdescrip_post = async (req, res) => {

  const { postadminid, offerid, userid, username, emailadmin, offertitle, offertype, uno_offer } = req.body;

  try {


      const no_offer = (uno_offer-'0')+ 1;
      const user = await User.findByIdAndUpdate(userid, { no_offer: no_offer });
    const relation = await Relation.create({ postadminid, offerid, userid, username });
    const text = '' + username + ' applied for an offer you posted.';
    const subject = '' + username + ' applied for an Offer';
    console.log(emailadmin);
    var transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'officiumnoreply@gmail.com',
        pass: 'rvwmnobsxafpqqju'
      }
    });

    var mailOptions = {
      from: 'officiumnoreply@gmail.com',
      to: 'mithilesh03cookies@gmail.com',
      subject: subject,
      html: `<h2>${text}</h2><br><h3>Details of the Offer</h3><br> <h4>Offer Title: ${offertitle} <br> Offer Type: ${offertype}</h4>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ relat: relation._id });

  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}



// Profile of an User From Admin Page

module.exports.profile_get = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      var bday = momentjs(result.birthday).format('YYYY-MM-DD');
      res.render('profile', { user: result, title: 'Profile', bday: bday });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}


// Profile of an User From User Page

module.exports.userprofile_get = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      var bday = momentjs(result.birthday).format('YYYY-MM-DD');
      res.render('userprofile', { user: result, title: 'Profile', bday: bday });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}


// Update Profile of an User From User Page

module.exports.updateprofile_get = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      var bday = momentjs(result.birthday).format('YYYY-MM-DD');
      res.render('updateprofile', { user: result, title: 'Profile', bday: bday });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}


// Update Resume of an User From User Page

module.exports.updateresume_get = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      var bday = momentjs(result.birthday).format('YYYY-MM-DD');
      res.render('updateresume', { user: result, title: 'Update Resume', bday: bday });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });
}

// updateprofile_post
module.exports.updateprofile_post = async (req, res) => {
  const { name, email, gender, birthday, number, userid } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userid, { name: name, email: email, gender: gender, birthday: birthday, number: number });
    //create a jwt
    //place the jwt into a cookie and send it as response 
    res.status(201).json({ user: user._id });

  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


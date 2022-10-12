const User = require('../models/User');
const Admin = require('../models/Admin');
const Offer = require('../models/Offer');
const Relation = require('../models/Relation');
const Resume = require('../models/Resume');




// Super Admin
module.exports.sadmin_get = async (req, res) => {
    // Offer.find().sort({ createdAt: -1 })
    //     .then(result => {
    //        Resume.find().sort({createdAt: -1}).then(
    //         resume =>{
    //           Relation.find().sort({createdAt: -1}).then( relations =>{
    //             res.render('sadmin', { offers: result,resumes:resume, tittle: 'Super Admin',relations:relations });
    //           }).catch(err =>{
    //             console.log(err);
    //           });
    //         }
    //        ).catch(err => {
    //         console.log(err);
    //        });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     }); 
  try {
    const useroffer = await User.aggregate(
      [
        {
          $group:
          {
            _id: null,
            totaloffer: { $sum: "$no_offer"},
          }
        }
      ]
    );
  
    // const users = await User.find();
    // const admins = await Admin.find();
    // users:users,admins:admins
  
    const offergroup = await Offer.aggregate(
      [
        {
          $group:
          {
            _id: "$company",
            count: { $sum: 1},
          }
        }
      ]
    );
  
    res.render('sadmin', { useroffer: useroffer, title: 'Super Admin',offergroup:offergroup});
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
    
  
  
  }


  // List of Users Page Get
  module.exports.listuser_get = async (req, res) => {
  try {
    const users = await User.find();
    // const admins = await Admin.find();
    // users:users,admins:admins
    
  
    res.render('listuser', { users: users, title: 'Super Admin'});
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
              count: { $sum: 1},
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
              count: { $sum: 1},
            }
          }
        ]
      );
      const admins = await Admin.find();
      res.render('listadmin', { admins: admins, title: 'Super Admin',offercounts:offercounts,applycounts:applycounts});
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
    
    }
const User = require('../models/User');
const Admin = require('../models/Admin');
const Offer = require('../models/Offer');
const Relation = require('../models/Relation');
const Resume = require('../models/Resume');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const binary = mongodb.Binary;

 // GET FUNCTIONS


    // User functions 

        //User Dashboard get function
        module.exports.dashboard_get = (req,res) => {
            Offer.find().sort({ createdAt: -1 })
          .then(result => {
             Resume.find().sort({createdAt: -1}).then(
              resume =>{
                res.render('dashboard', { offers: result,resumes:resume, tittle: 'Dashboard' });
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
        module.exports.adminpage_get = (req,res) => {

          Offer.find().sort({ createdAt: -1 })
          .then(result => {
                Relation.find().sort({ createdAt: -1 })
                .then(relations => {
                     res.render('adminpage', { relations:relations,offers: result, title: 'Admin Dashboard' });
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
        module.exports.descrip_get = (req,res) => {
            const id = req.params.id;
            Offer.findById(id)
              .then(result => {
                  const adminid =result.adminid;
                     Admin.findById(adminid).then( postadmin => {
                      
                      res.render('descrip', { offer: result, title: 'Description',postadmin:postadmin });
                     }).catch(err =>{
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
        module.exports.newoffer_get = (req,res) => {
            res.render('newoffer',{tittle:'New Offer'});   
        }


  //POST FUNCTION
  
     // Admin function to create a new offer 
      

     module.exports.newoffer_post = async (req, res) => {
        const {  company, tittle,  type, description } = req.body;
        // console.log( tittle,  type, description);

        const token = req.cookies.jwtadmin;
        if (token) {
          jwt.verify(token, 'WingardiumLeviosa', async (err, decodedToken) => {
            if (err) {
              console.log(err);
            } else {
              const admin = await Admin.findById(decodedToken.id);
                    try{
                        const adminid = admin._id;
                        const offer = await Offer.create({ company, tittle,  type, description, adminid });
                        res.status(201).json({offer:offer._id});
            
                    }
                    catch (err){
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
      res.json({ redirect: '/adminpage' });
    })
    .catch(err => {
      console.log(err);
    });
}

// User description 

    module.exports.userdescrip_get = (req,res) => {
      const id = req.params.id;
      console.log(id);
      Offer.findById(id)
        .then(result => {
            const adminid =result.adminid;
            const value=0;
              Admin.findById(adminid).then( postadmin => {
                          Relation.find().sort({ createdAt: -1 })
                          .then(relations => {
                              res.render('userdescrip', { value:value,offer:result,relations: relations, title: 'Description',postadmin:postadmin });
                          })
                          .catch(err => {
                            console.log(err);
                          }); 
              }).catch(err =>{
                console.log(err);
              })
        })
        .catch(err => {
          console.log(err);
          res.render('404', { title: 'Error' });
        });   
    }


// User Description POST 



module.exports.userdescrip_post = async (req,res) => {
    
   const { postadminid, offerid, userid, username } = req.body; 

  try{
          const relation = await Relation.create({ postadminid, offerid, userid, username });

          res.status(201).json({relat:relation._id});

  }
  catch (err){
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
  }




  
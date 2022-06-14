const User = require('../models/User');
const Admin = require('../models/Admin');

 // GET FUNCTIONS


    // User functions 

        //User Dashboard get function
        module.exports.dashboard_get = (req,res) => {
            res.render('dashboard',{tittle:'Dashboard'});   
        }

        //Admin Dashboard get function
        module.exports.adminpage_get = (req,res) => {
            res.render('adminpage',{tittle:'Admin Dashboard'});   
        }

        //Description of JOB in User get function
        module.exports.descrip_get = (req,res) => {
            res.render('descrip',{tittle:'Description'});   
        }

    
    //Admin function
       
        // Create new offer 
        module.exports.newoffer_get = (req,res) => {
            res.render('newoffer',{tittle:'New Offer'});   
        }

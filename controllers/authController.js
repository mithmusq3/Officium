const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken'); 
 

//Handle Errors function
    
    handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { name:'', email: '', number: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    
    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }
    
    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
    
    return errors;
    }


// Create Tokens 

 const maxAge = 3 * 24 * 60 * 60 ;
 // in seconds - 3 days

 const createToken = (id) => {
      return jwt.sign({ id }, 'WingardiumLeviosa',{
        expiresIn:maxAge
      });
      // first argument is payload of jwt, second is used to create a signature for jwt along with
      //payload and hashed , third argument is a options argument 
      // here we can set the expires property 
 }

 // GET FUNCTIONS


    // User functions 

        //Signup get function
        module.exports.signup_get = (req,res) => {
            res.render('signup',{tittle:'Signup'});   
        }

        //Login get function
        module.exports.login_get = (req,res) => {
            res.render('login',{tittle:'Login'});   
        }


    // Admin functions

        //Admin Signup get function
        module.exports.adm_signup_get = (req,res) => {
            res.render('adminsignup',{tittle:'Admin Signup'});   
        }

        //Admin login get function
        module.exports.adm_login_get = (req,res) => {
            res.render('adminlogin',{tittle:'Admin Login'});    
        }



// POST FUNCTIONS

    
    // User functions
    
        //Signup Post function
        module.exports.signup_post = async (req,res) => {
        const { name, email, gender, birthday, number, password } = req.body;
        
        try{
                const user = await User.create({ name, email, gender, birthday, number, password });
                //create a jwt
                const token = createToken(user._id);
                //place the jwt into a cookie and send it as response 
                res.cookie('jwt',token, { httpOnly:true, maxAge:maxAge*1000 } );
                res.status(201).json({user:user._id});

        }
        catch (err){
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
        }

        //Login post function
        module.exports.login_post = async (req,res) => {
        const { email , password } = req.body;
         
        try {
            const user = await User.login( email , password );
            //create a jwt
            const token = createToken(user._id);
            //place the jwt into a cookie and send it as response 
            res.cookie('jwt',token, { httpOnly:true, maxAge:maxAge*1000 } );
            res.status(200).json({user:user._id});
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
        }

    
    // Admin functions

        //Admin Signup post function
        module.exports.adm_signup_post = async (req,res) => {
            const { name, email, number, password } = req.body;
            
            try{
                const admin = await Admin.create({ name, email, number, password });

                //create a jwt
                const admintoken = createToken(admin._id);
                //place the jwt into a cookie and send it as response 
                res.cookie('jwtadmin',admintoken, { httpOnly:true, maxAge:maxAge*1000 } );
                res.status(201).json({admin:admin._id});
            }
            catch (err){
                const errors = handleErrors(err);
                res.status(400).json({ errors });
            }
        }
        
        //Admin Login post function
        module.exports.adm_login_post = async (req,res) => {

        const {  email,  password } = req.body;
         
        try {
            const admin = await Admin.login(  email, password );
            //create a jwt
            const token = createToken(admin._id);
            //place the jwt into a cookie and send it as response 
            res.cookie('jwtadmin',token, { httpOnly:true, maxAge:maxAge*1000 } );
            res.locals.admin_id=admin._id;
            res.status(200).json({admin:admin._id});
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({errors});
        }
        }


        //Logout
        module.exports.logout_get = async (req,res) => {
            res.cookie('jwt','', { maxAge: 1 } );
            res.redirect('/');
        }

        //Logout Admin
        module.exports.logoutadmin_get = async (req,res) => {
            res.cookie('jwtadmin','', { maxAge: 1 } );
            res.redirect('/admin');
        }

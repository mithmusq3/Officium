const User = require('../models/User')
const Admin = require('../models/Admin')
 

//Handle Errors function
    
    handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    
    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
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
        const { email , password } = req.body;
        
        try{
                const user = await User.create({ email , password });
                res.status(201).json(user);
        }
        catch (err){
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
        }

        //Login post function
        module.exports.login_post = async (req,res) => {
        const { email , password } = req.body;
        console.log(email,password);
        res.send('user login');
        }

    
    // Admin functions

        //Admin Signup post function
        module.exports.adm_signup_post = async (req,res) => {
            const { email , password } = req.body;
            
            try{
                const admin = await Admin.create({ email , password });
                res.status(201).json(admin);
            }
            catch (err){
                const errors = handleErrors(err);
                res.status(400).json({ errors });
            }
        }
        
        //Admin Login post function
        module.exports.adm_login_post = async (req,res) => {
            const { email , password } = req.body;
            console.log(email,password);
            res.send('admin login');
        }

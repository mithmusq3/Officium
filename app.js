const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const accessRoutes = require('./routes/accessRoutes');
const cookieParser = require('cookie-parser');

// const morgan = require('morgan');
const mongoose = require('mongoose');
const PORT=7000;



//Connecting to DB
// const dbURI ='mongodb+srv://mithu:mithu1234@nodetuts.zr3yi.mongodb.net/?retryWrites=true&w=majority';
const dbURI = 'mongodb://127.0.0.1:27017'
    mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true})
      .then((result)=>{
        console.log("Connected to DB");
        //listen for requests in port 3000 (door no)
        app.listen(PORT);
        console.log("Listening to port no: ",PORT);
    })
      .catch((err)=>{
        console.log(err);
    })


//register view
app.set('view engine','ejs')

//middleware
app.use(express.json());
app.use(cookieParser());


// It makes all the files under public folder to be visible to the browser statically 
app.use(express.static('public'));

// To log request type - 3rd party middleware morgan
// app.use(morgan('dev'));

// response to that requests 

    // //login page 
    //     app.get('/',  (req,res)=>{
    //         res.render('login',{tittle:'Login'});   
    //     });

    // //signup page 
    //     app.get('/signup',  (req,res)=>{

    //         res.render('signup',{tittle:'Signup'});   
    //     });

    // //admin register page 
    //     app.get('/admin',  (req,res)=>{
    //         res.render('adminlogin',{tittle:'Admin Login'});   
    //     });
    // //signup page 
    //     app.get('/adminsign',  (req,res)=>{
    //         res.render('adminsignup',{tittle:'Admin Signup'});   
    //     });

    

    //routes
    app.use(authRoutes);
    app.use(accessRoutes);
    
  //  //Setting cookies 

  // app.get('/set-cookies', (req,res)=>{

  //     //res.setHeader('Set-Cookie','newUser=true');
  //     res.cookie('newUser',false);
  //     //property - secure:true cookie will be stored only if it is called in secured connection for example via https request 
  //     //we also have httpOnly:true property which can't be accesed from the javascript 
  //     // Try it out in the console - cmd: document.cookie
  //     res.cookie('isEmployee',true,{ maxAge: 1000*60*60*24, httpOnly:true });
  //     res.send('you got the cookies');
  //     Here max Age is in milli seconds 
  // });
  
  // //reading coookies

  // app.get('/read-cookies',(req,res)=>{

  //   const cookies = req.cookies;
  //   console.log(cookies);

  //   res.json(cookies);
  // });



    //404 - error page 

    app.use((req,res)=>{
        res.render('404',{tittle:'Error 404'});  
    });
    


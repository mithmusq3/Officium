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

    //routes
    app.use(authRoutes);
    app.use(accessRoutes);

    //404 - error page 

    app.use((req,res)=>{
        res.render('404',{tittle:'Error 404'});  
        console.log('Page not found at all');
    });
    


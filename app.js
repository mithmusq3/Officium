const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const accessRoutes = require('./routes/accessRoutes');
const sadminRoutes = require('./routes/sadminRoutes');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const mongoDB = require('mongodb');
const Resume = require('./models/Resume');
const Offer = require('./models/Offer');
const User = require('./models/User');
const Relation = require('./models/Relation');
const momentjs = require('moment');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const fs = require('fs');

const objectid = mongoDB.ObjectId;
const binary = mongoDB.Binary
const bodyParser =require('body-parser');


// const morgan = require('morgan');
const mongoose = require('mongoose');


//Connecting to DB
const dbURI = process.env.DBURI;
// const dbURI = 'mongodb://127.0.0.1:27017'
    mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true})
      .then((result)=>{
        console.log("Connected to DB");
        //listen for requests in port 3000 (door no)
        app.listen(process.env.PORT);
        console.log("Listening to port no: ",process.env.PORT);
    })
      .catch((err)=>{
        console.log(err);
    })


//register view
app.set('view engine','ejs')

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded(
  { extended:true }
));


// It makes all the files under public folder to be visible to the browser statically 
app.use(express.static('public'));



  app.get('/download/:id', (req,res)=>{
    const user_id = req.params.id;
    const idofuser = objectid(user_id);
    Resume.findOne({userid:idofuser}).then(resume =>{
      let buffer = resume.data;
      // fs.writeFileSync('./uploads/resume.pdf', buffer);
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=resume.pdf`
        });
        res.send(buffer);
        res.status(200);
    }).catch(err =>{
      console.log(err);
    })
      
  });
  


  app.post('/upload/:id',requireAuth, checkUser,async (req,res)=>{
    const user_id = req.params.id;
      const userid = objectid(user_id);
      const contenttype = req.files.resume.mimetype;
      try {
      let file = { userid: userid, data:binary(req.files.resume.data),  contenttype: contenttype};
      // console.log(file);
      const resume = await Resume.create(file);
      console.log('Resume Inserted');
      Offer.find().sort({ createdAt: -1 })
      .then(result => {
        Resume.find().sort({createdAt: -1}).then(
          resume =>{
            Relation.find().sort({createdAt: -1}).then( relations =>{
              res.render('dashboard', { offers: result,resumes:resume, tittle: 'Dashboard',relations:relations });
            }).catch(err =>{
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
      } catch (err) {
        
        console.log(err);
      }
      
  
  });

app.post('/updateuserresume/:id', requireAuth, checkUser,async (req,res)=>{
  const user_id = req.params.id;
    const userid = objectid(user_id);
    const path = 'userprofile';
    const contenttype = req.files.resume.mimetype;
    try {
    let file = { userid: userid, data:binary(req.files.resume.data),  contenttype: contenttype};
    // console.log(file);
    const resume = await Resume.findOneAndUpdate({userid:userid},file);
    console.log('Resume Updated');  
    User.findById(userid)
    .then(result => {
      var bday = momentjs(result.birthday).format('YYYY-MM-DD');
      res.render(path, { user:result, title: 'Profile',bday:bday });
                      })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Error' });
    });  
    } catch (err) {
      
      console.log(err);
    }
    

});    




    //routes
    app.use(sadminRoutes);
    app.use(authRoutes);
    app.use(accessRoutes);

    //404 - error page 

    app.use((req,res)=>{
        res.render('404',{tittle:'Error 404'});  
        console.log('Page not found at all');
    });


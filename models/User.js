const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

     name: {
       type: String,
       required: [true,'Please enter a name']
     },

     email: {
         type: String,
         required: [true,'Please enter an email'],
         unique: true,
         lowercase: true,
         validate: [isEmail,'Please enter a valid email']
     },

     gender: {
        type: String,
        required: true
     },

     birthday: {
        type: Date,
        required: true
     },
     number: {
        type: Number,
        required: [true,'Please enter a number'],
        unique: true,
        minlength: [10,'Enter a valid number']
     },
     password: {
         type: String,
         required: [true,'Please enter a Password'],
         minlength: [8,'Minimun password length is 8 characters']
     },
     no_offer:{
        type:Number,
        required:true
     }
},{ timestamps: true });


//Middleware Hooks

    // fire a function after doc saved to db
    userSchema.post('save', function (doc, next) {
        console.log('new user was created & saved', doc);
        next();
    });

    // fire a function before doc saved to db
    userSchema.pre('save', async function (next) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

  
    // Static method to login user 
    userSchema.statics.login = async function (email,password) {
        const user = await this.findOne({ email });
        if(user){
           const auth = await bcrypt.compare(password,user.password);
                if(auth){
                    return user;
                }
                throw Error('incorrect password');
        }
        throw Error('incorrect email');

    }



const User = mongoose.model('user',userSchema);

module.exports = User;
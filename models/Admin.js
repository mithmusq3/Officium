const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
      
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
     
     number: {
        type: Number,
        required: [true,'Please enter a number'],
        unique: true,
        minlength: [10,'Enter a valid number']
     },

     password: {
         type: String,
         required: [true,'Please enter a Password'],
         minlength: [6,'Minimun password length is 6 characters']
     }

}, { timestamps: true });


//Middleware Hooks

    // fire a function after doc saved to db
    adminSchema.post('save', function (doc, next) {
        console.log('new admin was created & saved', doc);
        next();
    });

    // fire a function before doc saved to db
    adminSchema.pre('save', async function (next) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

// Static method to login Admin 
    adminSchema.statics.login = async function (email,password) {
        const admin = await this.findOne({ email });
        if(admin){
           const auth = await bcrypt.compare(password,admin.password);
                if(auth){
                    return admin;
                }
                throw Error('Incorrect password');
        }
        throw Error('Incorrect email');

    }

const Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;
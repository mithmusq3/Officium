const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({

     email: {
         type: String,
         required: [true,'Please enter an email'],
         unique: true,
         lowercase: true,
         validate: [isEmail,'Please enter a valid email']
     },

     password: {
         type: String,
         required: [true,'Please enter a Password'],
         minlength: [6,'Minimun password length is 6 characters']
     }

});


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

const Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;
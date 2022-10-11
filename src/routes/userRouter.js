const express = require('express');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

//finish user registration:
// route to create user account
userRouter.post('/register-user', async (req, res, next) => {
    // we don't have a way to uniquely identify users by email, username, or phone
    // we are storing the user's password in our database, this is bad
    // need to get credentials and user info from the front end
    // then HASH the password with brypt before saving in db

    const { firstName, lastName, email, password, profilePicture, isAdmin } = req.body;

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('hashedPassword: ', hashedPassword);

    const userDocument = new UserModel({
        firstName, lastName, email, hashedPassword, profilePicture, isAdmin
    })

    userDocument.save();

    res.send({
        user: {
            id: userDocument._id,
            firstName, lastName, email, profilePicture,
            isAdmin: userDocument.isAdmin
        }
    })

});

module.exports = userRouter;







// app.get('/home', (req, res, next) => {
//     next()
// });

// app.post('/user', (req, res, next)=>{
// })

const express = require('express');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const cleanUser = (userDocument) => {
    return {
        id: userDocument._id,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        profilePicture: userDocument.profilePicture,
        isAdmin: userDocument.isAdmin,
    }
}


const userRouter = express.Router();

//finish user registration:
// route to create user account
userRouter.post('/register-user', async (req, res, next) => {
    // we don't have a way to uniquely identify users by email, username, or phone
    // we are storing the user's password in our database, this is bad
    // need to get credentials and user info from the front end
    // then HASH the password with brypt before saving in db

    const { firstName, lastName, email, password, profilePicture, isAdmin } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userDocument = new UserModel({
            firstName, lastName, email, hashedPassword, profilePicture
        })
        await userDocument.save();

        //send user info to frontend
        res.send({ user: cleanUser(userDocument) });
    }
    catch (error) {
        next(error);
    }

});




userRouter.post('/sign-in', async (req, res, next) => {
    // get the credentials (data) from the request
    const { email, password } = req.body.credentials;

    try {
        // check if the user exists in the db
        const foundUser = await UserModel.findOne({ email: email });
        console.log("foundUser ", foundUser);

        // if the user exists, verify the password
        if (!foundUser) {
            return res.status(401).send('user not found, or incorrect credentials');
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.hashedPassword);
        if (!passwordMatch) {
            return res.status(401).send('user not found, or incorrect credentials');
        }

        // if the user exists and the password matches, the user can be successfully authenticated
        // send user data back to the client
        res.send({ user: cleanUser(foundUser) });
    } catch (error) {
        next(error);
    }

    // provide a way for the user to not have to enter their info again in future requests

})

module.exports = userRouter;







// app.get('/home', (req, res, next) => {
//     next()
// });

// app.post('/user', (req, res, next)=>{
// })

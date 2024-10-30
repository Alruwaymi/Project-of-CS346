/**
* call library
*/
const User = require('../models/User')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy

/**
* passport serializeUser
*/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/**
* passport deserializeUser 
*/
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

/**
* register user using passport
*/
passport.use('local.new', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    if (req.body.password != req.body.confirm_password) {
        return done(null, false, req.flash('error', 'Passwords do not match'))
    } else {
        try {
            // find user by email
            const user = await User.findOne({ email });
            if (user) {
                return done(null, false, req.flash('error', 'Email already exists'));
            }
            if (!user) {
                // create new User object
                const newUser = new User({
                    Fname: req.body.firstname,
                    LName: req.body.lastname,
                    Contact: req.body.contact,
                    email: req.body.email,
                    password: new User().hashSyncPass(req.body.password),
                    avatar: "profile.png",
                    role: req.body.role,
                    created_at: Date.now()
                });

                const savedUser = await newUser.save();
                return done(null, savedUser, req.flash('success', 'New User Added'));
            }
        } catch (err) {
            return done(err);
        }
    }
}));

/**
* login strategy using passport
*/
passport.use('local.login', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    try {
        // find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, req.flash('error', 'User not found'));
        }

        // compare password
        if (user.compareSyncPass(password, user.password)) {
            return done(null, user, req.flash('success', 'Welcome Back ' + user.Fname));
        } else {
            return done(null, false, req.flash('error', 'Please check your password'));
        }
    } catch (err) {
        return done(null, false, req.flash('error', 'Error...'));
    }
}));

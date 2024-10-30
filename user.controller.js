/**
* call library
*/
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

/**
* post avatar
*
* @param req
* @param res
*/
exports.post_avatar = async function(req, res) {
    try {
        let newFields = {
            avatar: req.file.filename
        };
        await User.updateOne({_id: req.user._id}, newFields);
        res.redirect('/users/profile');
    } catch (err) {
        res.redirect('/users/profile');
    }
}

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_users = async function(req, res) {
    try {
        let page = 1;
        if(req.params.page){
            page = parseInt(req.params.page);
        }
        if(req.params.page == 0) {
            page = 1;
        }
        
        let q = {
            skip: 5 * (page-1),
            limit: 5
        };

        const totalDocs = await User.countDocuments({});
        const users = await User.find(
            {_id: {$ne: req.user._id}}, 
            {}, 
            q
        ).sort({created_at: 'desc'});

        res.render('user/index', {
            users: users,
            total: totalDocs,
            page: page,
            title: "All users",
            success: req.flash('success')
        });

    } catch (err) {
        res.redirect('/user/new');
    }
}

/**
* update user
*
* @param req
* @param res
*/
exports.update_user = async function(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/users/profile');
        }

        let newUser = new User();
        let newFields = {
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Contact: req.body.contact,
            email: req.body.email,
        };

        if(req.body.password) {
            if(req.body.password !== req.body.confirm_password) {
                req.flash('error', "The password does not match");
                return res.redirect('/users/profile');
            }
            newFields.password = newUser.hashSyncPass(req.body.password);
        }

        await User.updateOne({_id: req.user._id}, newFields);
        req.flash('success', "The user was updated successfully");
        res.redirect('/users/profile');

    } catch (err) {
        req.flash('error', "Update failed");
        res.redirect('/users/profile');
    }
}

/**
* logout user
*
* @param req
* @param res
*/
exports.logout_user = function(req, res) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/users/login');
    });
}

/**
* get user by id
*
* @param req
* @param res
*/
exports.find_user_by_id = async function(req, res) {
    try {
        const user = await User.findOne({_id: req.params.id});
        res.render('user/single', {
            user: user,
            title: "single user"
        });
    } catch (err) {
        res.redirect('/users/all');
    }
}

/**
* edit user by id
*
* @param req
* @param res
*/
exports.edit_user_by_id = async function(req, res) {
    try {
        const user = await User.findOne({_id: req.params.id});
        res.render('user/edit', {
            user: user,
            title: "edit user",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        res.redirect('/users/all');
    }
}

/**
* update user by id
*
* @param req
* @param res
*/
exports.update_user_by_id = async function(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/users/edit/' + req.body.id);
        }

        let newUser = new User();
        let newFields = {
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Contact: req.body.contact,
            email: req.body.email,
            role: req.body.role
        };

        if(req.body.password) {
            if(req.body.password !== req.body.confirm_password) {
                req.flash('error', "The password does not match");
                return res.redirect('/users/edit/' + req.body.id);
            }
            newFields.password = newUser.hashSyncPass(req.body.password);
        }

        await User.updateOne({_id: req.body.id}, newFields);
        req.flash('success', "The user was updated successfully");
        res.redirect('/users/edit/' + req.body.id);

    } catch (err) {
        req.flash('error', "Update failed");
        res.redirect('/users/edit/' + req.body.id);
    }
}

/**
* render user profile
*
* @param req
* @param res
*/
exports.render_user_profile = function(req, res) {
    res.render('user/profile', {
        success: req.flash('success'),
        errors: req.flash('errors'),
        error: req.flash('error'),
        title: "profile"
    });
}

/**
* render user
*
* @param req
* @param res
*/
exports.render_user = function(req, res) {
    res.render('user/new', {
        error: req.flash('error'),
        title: "New user"
    });
}

/**
* render user login
*
* @param req
* @param res
*/
exports.render_user_login = function(req, res) {
    res.render('user/login', {
        error: req.flash('error'),
        title: "Login To Panel"
    });
}

/**
* delete user by id
*
* @param req
* @param res
*/
exports.delete_user_by_id = async function(req, res) {
    try {
        await User.deleteOne({_id: req.body.id});
        req.flash('success', "The user was deleted successfully");
        res.redirect('/users/all');
    } catch (err) {
        req.flash('error', 'User delete error');
        res.redirect('/users/single/' + req.body.id);
    }
}
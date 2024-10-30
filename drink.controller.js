/**
* call library
*/
const Drink = require('../models/Drink')
const { validationResult } = require('express-validator');

/**
* new drink
*
* @param req
* @param res
*/
exports.new_drink = async function(req, res) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            res.redirect('/drink/new')
            return;
        }

        let newDrink = new Drink({
            Name: req.body.name,
            Alcohol: req.body.alcohol,
            Type: req.body.type,
            Description: req.body.description,
            created_at: Date.now(),
        })

        await newDrink.save();
        req.flash('success', 'The drink was created successfully')
        res.redirect('/drink/all')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Error creating drink')
        res.redirect('/drink/new')
    }
}

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_drink = async function(req, res) {
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

        const totalDocs = await Drink.countDocuments({});
        
        const drink = await Drink.find({}, {}, q)
            .sort({created_at: 'desc'});

        res.render('drink/index', {
            drink: drink,
            total: totalDocs,
            page: page,
            title: "All drink",
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/drink/new');
    }
}

/**
* get drink by id
*
* @param req
* @param res
*/
exports.find_drink_by_id = async function(req, res) {
    try {
        const drink = await Drink.findOne({_id: req.params.id});
        if (!drink) {
            req.flash('error', 'Drink not found');
            return res.redirect('/drink/all');
        }
        
        res.render('drink/single', {
            drink: drink,
            title: "single drink"
        });
    } catch (err) {
        console.error(err);
        res.redirect('/drink/all');
    }
}

/**
* edit drink by id
*
* @param req
* @param res
*/
exports.edit_drink_by_id = async function(req, res) {
    try {
        const drink = await Drink.findOne({_id: req.params.id});
        if (!drink) {
            req.flash('error', 'Drink not found');
            return res.redirect('/drink/all');
        }

        res.render('drink/edit', {
            drink: drink,
            title: "edit drink",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/drink/all');
    }
}

/**
* update drink by id
*
* @param req
* @param res
*/
exports.update_drink_by_id = async function(req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            return res.redirect('/drink/edit/' + req.body.id)
        }

        let newfields = {
            Name: req.body.name,
            Alcohol: req.body.alcohol,
            Type: req.body.type,
            Description: req.body.description,
        }
        
        await Drink.updateOne({_id: req.body.id}, newfields);
        req.flash('success', "The drink was updated successfully");
        res.redirect('/drink/edit/' + req.body.id);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating drink');
        res.redirect('/drink/edit/' + req.body.id);
    }
}

/**
* render drink
*
* @param req
* @param res
*/
exports.render_drink = function(req, res) {
    res.render('drink/new', {
        errors: req.flash('errors'),
        title: "new drink"
    })
}

/**
* delete drink by id
*
* @param req
* @param res
*/
exports.delete_drink_by_id = async function(req, res) {
    try {
        await Drink.deleteOne({_id: req.body.id});
        req.flash('success', "The drink was deleted successfully");
        res.redirect('/drink/all');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error deleting drink');
        res.redirect('/drink/single/' + req.body.id);
    }
}
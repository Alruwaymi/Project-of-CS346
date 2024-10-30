const Food = require('../models/Food');
const { check, validationResult } = require('express-validator');

/**
* new food
*
* @param req
* @param res
*/
exports.new_food = async function(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/food/new');
        }

        const newFood = new Food({
            Name: req.body.name,
            Price: req.body.price,
            Type: req.body.type,
            Category: req.body.category,
            Description: req.body.description,
            created_at: Date.now(),
        });

        await newFood.save();
        req.flash('success', 'The food was created successfully');
        res.redirect('/food/all');
        
    } catch (err) {
        console.log(err);
        res.redirect('/food/new');
    }
};

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_food = async function(req, res) {
    try {
        let page = 1;
        if (req.params.page) {
            page = parseInt(req.params.page);
        }
        if (req.params.page == 0) {
            page = 1;
        }
        
        const q = {
            skip: 5 * (page - 1),
            limit: 5
        };

        const totalDocs = await Food.countDocuments({});
        const food = await Food.find({}, {}, q).sort({ created_at: 'desc' });

        res.render('food/index', {
            food: food,
            total: totalDocs,
            page: page,
            title: "All food",
            success: req.flash('success')
        });
    } catch (err) {
        console.log(err);
        res.redirect('/food/new');
    }
};

/**
* get food by id
*
* @param req
* @param res
*/
exports.find_food_by_id = async function(req, res) {
    try {
        const food = await Food.findOne({ _id: req.params.id });
        if (!food) {
            return res.redirect('/food/all');
        }
        res.render('food/single', {
            food: food,
            title: "single food"
        });
    } catch (err) {
        console.log(err);
        res.redirect('/food/all');
    }
};

/**
* edit food by id
*
* @param req
* @param res
*/
exports.edit_food_by_id = async function(req, res) {
    try {
        const food = await Food.findOne({ _id: req.params.id });
        if (!food) {
            return res.redirect('/food/all');
        }
        res.render('food/edit', {
            food: food,
            title: "edit food",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.log(err);
        res.redirect('/food/all');
    }
};

/**
* update food by id
*
* @param req
* @param res
*/
exports.update_food_by_id = async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/food/edit/' + req.body.id);
        }

        const newFields = {
            Name: req.body.name,
            Price: req.body.price,
            Type: req.body.type,
            Category: req.body.category,
            Description: req.body.description,
            created_at: Date.now(),
        };

        await Food.updateOne({ _id: req.body.id }, newFields);
        req.flash('success', "The food was updated successfully");
        res.redirect('/food/edit/' + req.body.id);
    } catch (err) {
        console.log(err);
        res.redirect('/food/all');
    }
};

/**
* render food
*
* @param req
* @param res
*/
exports.render_food = function(req, res) {
    res.render('food/new', {
        errors: req.flash('errors'),
        title: "New food"
    });
};

/**
* delete food by id
*
* @param req
* @param res
*/
exports.delete_food_by_id = async function(req, res) {
    try {
        await Food.deleteOne({ _id: req.body.id });
        req.flash('success', "The food was deleted successfully");
        res.redirect('/food/all');
    } catch (err) {
        console.log(err);
        req.flash('error', 'food delete error');
        res.redirect('/food/single/' + req.params.id);
    }
};
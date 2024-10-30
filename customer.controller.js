/**
* call library
*/
const Customer = require('../models/Customer');
const { check, validationResult } = require('express-validator');

/**
* new customer
*
* @param req
* @param res
*/
exports.new_customer = async function(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/customer/new');
        }

        const existingCustomer = await Customer.findOne({Email: req.body.email});
        
        if (existingCustomer) {
            req.flash('error', 'Email already exists');
            return res.redirect('/customer/new');
        }

        let newCustomer = new Customer({
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Contact: req.body.contact,
            Email: req.body.email,
            created_at: Date.now()
        });

        await newCustomer.save();
        req.flash('success', 'The Customer was created successfully');
        res.redirect('/customer/all');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Error creating customer');
        res.redirect('/customer/new');
    }
}

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_customers = async function(req, res) {
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

        const totalDocs = await Customer.countDocuments();
        const customers = await Customer.find({}, {}, q).sort({created_at: 'desc'});

        res.render('customer/index', {
            customers: customers,
            total: totalDocs,
            page: page,
            title: "All customer",
            success: req.flash('success')
        });

    } catch (err) {
        console.log(err);
        res.redirect('/customer/new');
    }
}

/**
* get customer by id
*
* @param req
* @param res
*/
exports.find_customer_by_id = async function(req, res) {
    try {
        const customer = await Customer.findOne({_id: req.params.id});
        if (!customer) {
            req.flash('error', 'Customer not found');
            return res.redirect('/customer/all');
        }
        
        res.render('customer/single', {
            customer: customer,
            title: "single customer"
        });
    } catch (err) {
        console.log(err);
        res.redirect('/customer/all');
    }
}

/**
* edit customer by id
*
* @param req
* @param res
*/
exports.edit_customer_by_id = async function(req, res) {
    try {
        const customer = await Customer.findOne({_id: req.params.id});
        if (!customer) {
            req.flash('error', 'Customer not found');
            return res.redirect('/customer/all');
        }

        res.render('customer/edit', {
            customer: customer,
            title: "edit customer",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.log(err);
        res.redirect('/customer/all');
    }
}

/**
* update customer by id
*
* @param req
* @param res
*/
exports.update_customer_by_id = async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/customer/edit/' + req.body.id);
        }

        const newFields = {
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Contact: req.body.contact,
            Email: req.body.email,
        };

        await Customer.updateOne({_id: req.body.id}, newFields);
        req.flash('success', "The customer was updated successfully");
        res.redirect('/customer/edit/' + req.body.id);

    } catch (err) {
        console.log(err);
        req.flash('error', 'Update failed');
        res.redirect('/customer/edit/' + req.body.id);
    }
}

/**
* render customer
*
* @param req
* @param res
*/
exports.render_customer = function(req, res) {
    res.render('customer/new', {
        errors: req.flash('errors'),
        error: req.flash('error'),
        title: "New customer"
    });
}

/**
* delete customer by id
*
* @param req
* @param res
*/
exports.delete_customer_by_id = async function(req, res) {
    try {
        await Customer.deleteOne({_id: req.body.id});
        req.flash('success', "The customer was deleted successfully");
        res.redirect('/customer/all');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Customer delete error');
        res.redirect('/customer/single/' + req.body.id);
    }
}
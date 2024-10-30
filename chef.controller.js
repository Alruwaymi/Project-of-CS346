/**
* call library
*/
const Chef = require('../models/Chef');
const { check, validationResult } = require('express-validator');

/**
* new chef
*
* @param req
* @param res
*/
exports.new_chef = async function(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/chef/new');
        }

        if (!req.body.birthdate) {
            req.flash('error', 'birthdate is empty');
            return res.redirect('/chef/new');
        }

        const existingChef = await Chef.findOne({ Email: req.body.email });
        if (existingChef) {
            req.flash('error', 'Email already exists');
            return res.redirect('/chef/new');
        }

        const newChef = new Chef({
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Email: req.body.email,
            Experience: req.body.experience,
            Type: req.body.type,
            City: req.body.city,
            Postcode: req.body.postcode,
            Salary: req.body.salary,
            Sex: req.body.sex,
            Birthdate: req.body.birthdate,
            created_at: Date.now(),
        });

        await newChef.save();
        req.flash('success', 'The chef was created successfully');
        res.redirect('/chef/all');

    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while creating the chef');
        res.redirect('/chef/new');
    }
};

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_chef = async function(req, res) {
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

        const totalDocs = await Chef.countDocuments({});
        const chef = await Chef.find({}, {}, q).sort({ created_at: 'desc' });

        res.render('chef/index', {
            chef: chef,
            total: totalDocs,
            page: page,
            title: "All chefs",
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/chef/new');
    }
};

/**
* get chef by id
*
* @param req
* @param res
*/
exports.find_chef_by_id = async function(req, res) {
    try {
        const chef = await Chef.findOne({ _id: req.params.id });
        if (!chef) {
            return res.status(404).redirect('/chef/all');
        }
        res.render('chef/single', {
            chef: chef,
            title: "single chef"
        });
    } catch (err) {
        console.error(err);
        res.redirect('/chef/all');
    }
};

/**
* edit chef by id
*
* @param req
* @param res
*/
exports.edit_chef_by_id = async function(req, res) {
    try {
        const salary = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const city = ['Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Alger', 'Annaba', 'Batna', 'Béchar', 'Béjaïa', 'Biskra', 'Blida', 'Bordj Bou Arréridj', 'Bouira', 'Boumerdès', 'Chlef', 'ConstantineDjelfa', 'El Bayadh', 'El Oued', 'El Tarf', 'Ghardaïa', 'Guelma', 'Illizi', 'Jijel', 'Khenchela', 'Laghouat', 'MSila', 'Mascara', 'Médéa', 'Mila', 'Mostaganem', 'Naama', 'Oran', 'Ouargla', 'Oum el Bouaghi', 'Relizane', 'Saïda', 'Sétif', 'Sidi Bel Abbès', 'Skikda', 'Souk Ahras', 'Tamanrasset', 'Tébess', 'Tiaret', 'Tindouf', 'Tipaza', 'Tissemsilt', 'Tizi Ouzou', 'Tlemcen'];

        const chef = await Chef.findOne({ _id: req.params.id });
        if (!chef) {
            return res.status(404).redirect('/chef/all');
        }

        res.render('chef/edit', {
            salary: salary,
            city: city,
            chef: chef,
            title: "edit chef",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/chef/all');
    }
};

/**
* update chef by id
*
* @param req
* @param res
*/
exports.update_chef_by_id = async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/chef/edit/' + req.body.id);
        }

        const newFields = {
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Email: req.body.email,
            Experience: req.body.experience,
            Type: req.body.type,
            City: req.body.city,
            Postcode: req.body.postcode,
            Salary: req.body.salary,
            Sex: req.body.sex,
            Birthdate: req.body.birthdate,
        };

        await Chef.updateOne({ _id: req.body.id }, newFields);
        req.flash('success', "The chef was updated successfully");
        res.redirect('/chef/edit/' + req.body.id);
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while updating the chef');
        res.redirect('/chef/edit/' + req.body.id);
    }
};

/**
* render chef
*
* @param req
* @param res
*/
exports.render_chef = function(req, res) {
    const city = ['Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Alger', 'Annaba', 'Batna', 'Béchar', 'Béjaïa', 'Biskra', 'Blida', 'Bordj Bou Arréridj', 'Bouira', 'Boumerdès', 'Chlef', 'ConstantineDjelfa', 'El Bayadh', 'El Oued', 'El Tarf', 'Ghardaïa', 'Guelma', 'Illizi', 'Jijel', 'Khenchela', 'Laghouat', 'MSila', 'Mascara', 'Médéa', 'Mila', 'Mostaganem', 'Naama', 'Oran', 'Ouargla', 'Oum el Bouaghi', 'Relizane', 'Saïda', 'Sétif', 'Sidi Bel Abbès', 'Skikda', 'Souk Ahras', 'Tamanrasset', 'Tébess', 'Tiaret', 'Tindouf', 'Tipaza', 'Tissemsilt', 'Tizi Ouzou', 'Tlemcen'];
    res.render('chef/new', {
        city: city,
        title: "new chef",
        errors: req.flash('errors'),
        error: req.flash('error')
    });
};

/**
* delete chef by id
*
* @param req
* @param res
*/
exports.delete_chef_by_id = async function(req, res) {
    try {
        await Chef.deleteOne({ _id: req.body.id });
        req.flash('success', "The chef was deleted successfully");
        res.redirect('/chef/all');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Chef delete error');
        res.redirect('/chef/single/' + req.params.id);
    }
};
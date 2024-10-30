/**
* call library
*/
const Table = require('../models/Table');
const { validationResult } = require('express-validator');

/**
* new table
*
* @param req
* @param res
*/
exports.new_table = async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/table/new');
    } else {
        try {
            let newTable = new Table({
                Name: req.body.name,
                NumberPlace: req.body.numberplace,
                Type: req.body.type,
                Description: req.body.description,
                created_at: Date.now(),
            });

            await newTable.save();
            req.flash('success', 'The table was created successfully');
            res.redirect('/table/all');
        } catch (err) {
            console.log(err);
            res.redirect('/table/new');
        }
    }
} 

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_tables = async function(req, res) {
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

        const totalDocs = await Table.countDocuments({});
        
        const table = await Table.find({}, {}, q)
            .sort({created_at: 'desc'})
            .exec();

        res.render('table/index', {
            table: table,
            total: totalDocs,
            page: page,
            title: "All table",
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/drink/new');
    }
}

/**
* get table by id
*
* @param req
* @param res
*/
exports.find_table_by_id = async function(req, res) {
    try {
        const table = await Table.findOne({_id: req.params.id});
        
        res.render('table/single', {
            table: table,
            title: "single table"
        });
    } catch (err) {
        console.log(err);
        res.redirect('/table/all');
    }
}

/**
* edit table by id
*
* @param req
* @param res
*/
exports.edit_table_by_id = async function(req, res) {
    try {
        let number_place = [1,2,3,4,5,6,7,8,9,10];
        const table = await Table.findOne({_id: req.params.id});
        
        res.render('table/edit', {
            number_place: number_place,
            table: table,
            title: "edit table",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.log(err);
        res.redirect('/table/all');
    }
}

/**
* update table by id
*
* @param req
* @param res
*/
exports.update_table_by_id = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/table/edit/' + req.body.id);
    } else {
        try {
            let newfields = {
                Name: req.body.name,
                NumberPlace: req.body.numberplace,
                Type: req.body.type,
                Description: req.body.description,
            };
            let query = {_id: req.body.id};

            await Table.updateOne(query, newfields);
            req.flash('success', "The Table was updated successfully");
            res.redirect('/table/edit/' + req.body.id);
        } catch (err) {
            console.log(err);
            res.redirect('/table/all');
        }
    }
} 

/**
* render table
*
* @param req
* @param res
*/
exports.render_table = function(req,res) {
    let number_place = [1,2,3,4,5,6,7,8,9,10]
    res.render('table/new', {
        number_place:number_place,
        title:"new table",
        errors: req.flash('errors')
    })
} 

/**
* delete table by id
*
* @param req
* @param res
*/
exports.delete_table_by_id = async function(req, res) {
    try {
        let query = {_id: req.body.id};
        await Table.deleteOne(query);
        req.flash('success', "The Table was deleted successfully");
        res.redirect('/table/all');
    } catch (err) {
        req.flash('error', 'table delete error');
        res.redirect('/table/single/' + req.params.id);
    }
}
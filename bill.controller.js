/**
* call library
*/
const Bill = require('../models/Bill')
const Waiter = require('../models/Waiter')
const Food = require('../models/Food')
const Drink = require('../models/Drink')
const Table = require('../models/Table')
const Customer = require('../models/Customer')
const { validationResult } = require('express-validator');

/**
* new bill
*
* @param req
* @param res
*/
exports.new_bill = async function(req, res) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            return res.redirect('/bill/new')
        }

        let newBill = new Bill({
            Sub_Total: req.body.sub_total,
            Vat: req.body.vat,
            Total: req.body.total,
            drink_id: req.body.drink,
            food_id: req.body.food,
            waiter_id: req.body.waiter,
            table_id: req.body.table,
            CustomerID: req.body.customerID,
            created_at: Date.now(),
        })

        await newBill.save()
        req.flash('success', 'The bill was created successfully')
        res.redirect('/bill/all')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Error creating bill')
        res.redirect('/bill/new')
    }
}

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_bill = async function(req, res) {
    try {
        let page = 1
        if (req.params.page) {
            page = parseInt(req.params.page)
        }
        if (req.params.page == 0) {
            page = 1
        }
        let q = {
            skip: 5 * (page - 1),
            limit: 5
        }

        const totalDocs = await Bill.countDocuments()
        const bills = await Bill.find({}, {}, q).sort({created_at: 'desc'})

        res.render('bill/index', {
            bill: bills,
            total: totalDocs,
            page: page,
            title: "All Bills",
            success: req.flash('success')
        })
    } catch (err) {
        console.error(err)
        res.redirect('/bill/new')
    }
}

/**
* find data by bill id
*
* @param req
* @param res
*/
exports.find_bill_by_id = async function(req, res) {
    try {
        const bill = await Bill.findOne({_id: req.params.id})
        const customer = await Customer.findOne({_id: bill.CustomerID})

        res.render('bill/single', {
            bill: bill,
            customer: customer,
            title: "bill"
        })
    } catch (err) {
        console.error(err)
        res.redirect('/bill/all')
    }
}

/**
* edit bill by id
*
* @param req
* @param res
*/
exports.edit_bill_by_id = async function(req, res) {
    try {
        const [waiter, food, drink, table, customer, bill] = await Promise.all([
            Waiter.find({}),
            Food.find({}),
            Drink.find({}),
            Table.find({}),
            Customer.find({}),
            Bill.findOne({_id: req.params.id})
        ])

        res.render('bill/edit', {
            waiter: waiter,
            food: food,
            drink: drink,
            table: table,
            customer: customer,
            bill: bill,
            title: "edit bill",
            errors: req.flash('errors'),
            success: req.flash('success')
        })
    } catch (err) {
        console.error(err)
        res.redirect('/bill/all')
    }
}

/**
* update bill by id
*
* @param req
* @param res
*/
exports.update_bill_by_id = async function(req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            return res.redirect('/bill/edit/' + req.body.id)
        }

        let newfields = {
            Sub_Total: req.body.sub_total,
            Vat: req.body.vat,
            Total: req.body.total,
            drink_id: req.body.drink,
            food_id: req.body.food,
            waiter_id: req.body.waiter,
            table_id: req.body.table,
            CustomerID: req.body.customerID
        }

        await Bill.updateOne({_id: req.body.id}, newfields)
        req.flash('success', "The bill was updated successfully")
        res.redirect('/bill/edit/' + req.body.id)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Error updating bill')
        res.redirect('/bill/edit/' + req.body.id)
    }
}

/**
* render bill
*
* @param req
* @param res
*/
exports.render_bill = async function(req, res) {
    try {
        const [waiter, food, drink, table, customer] = await Promise.all([
            Waiter.find({}),
            Food.find({}),
            Drink.find({}),
            Table.find({}),
            Customer.find({})
        ])

        res.render('bill/new', {
            waiter: waiter,
            food: food,
            drink: drink,
            table: table,
            customer: customer,
            title: "new bill",
            errors: req.flash('errors')
        })
    } catch (err) {
        console.error(err)
        res.redirect('/bill/all')
    }
}

/**
* delete bill by id
*
* @param req
* @param res
*/
exports.delete_bill_by_id = async function(req, res) {
    try {
        await Bill.deleteOne({_id: req.body.id})
        req.flash('success', "The bill was deleted successfully")
        res.redirect('/bill/all')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Bill delete error')
        res.redirect('/bill/single/' + req.body.id)
    }
}
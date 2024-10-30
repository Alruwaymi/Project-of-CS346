/**
* call library
*/
const Booking = require('../models/Booking');
const Customer = require('../models/Customer')
const { check } = require('express-validator')

/**
* new booking
*
* @param req
* @param res
*/
exports.new_booking = function(req,res) {

        Customer.findOne({CustomerID: req.body.customerID}, (err,customer)=> {
            
            if(!err) {

                let newBooking = new Booking({
                    Date: req.body.date,
                    time: req.body.time,
                    number_place: req.body.number_place,
                    CustomerID:req.body.customerID,
                    created_at: Date.now()
                })

                if(req.body.date != ""){

                    newBooking.save( (err)=> {
                        if(!err) {
                            req.flash('success', ' The booking was created successfuly')
                            res.redirect('/booking/all')
                        } else {
                            console.log(err)
                        } 
                    })
                } else {
                    req.flash('error', 'Date is empty')
                    res.redirect('/booking/new')
                }

            } else {
                console.log(err)
            }
        
         })

}

/**
* get all data from database
*
* @param req
* @param res
*/
exports.all_booking = async function(req, res) {
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

        const totalDocs = await Booking.countDocuments({});
        
        const booking = await Booking.find({}, {}, q)
            .sort({created_at: 'desc'});

        res.render('booking/index', {
            booking: booking,
            total: totalDocs,
            page: page,
            title: "All booking",
            success: req.flash('success')
        });

    } catch (err) {
        console.error(err);
        res.redirect('/booking/new');
    }
}

/**
* find booking by id
*
* @param req
* @param res
*/
exports.find_booking_by_id = async function(req, res) {
    try {
        const booking = await Booking.findOne({_id: req.params.id});
        
        res.render('booking/single', {
            booking: booking,
            title: "single booking"
        });
    } catch (err) {
        console.error(err);
        res.redirect('/booking/all');
    }
}

/**
* edit booking by id
*
* @param req
* @param res
*/
exports.edit_booking_by_id = async function(req, res) {
    const time = ["6:00am","6:30am","7:00am","7:30am","8:00am","8:30am","9:00am","9:30am","10:00am","10:30am","11:00am","11:30am","12:00pm","12:30pm","1:00pm","1:30pm","2:00pm","2:30pm","3:00pm","3:30pm","4:00pm","4:30pm","5:00pm","5:30pm","6:00pm","6:30pm","7:00pm","7:30pm","8:00pm","8:30pm","9:00pm","9:30pm","10:00pm","10:30pm","11:00pm","11:30pm"];
    const number_place = [1,2,3,4,5,6,7,8,9,10];

    try {
        const [booking, customer] = await Promise.all([
            Booking.findOne({_id: req.params.id}),
            Customer.find({})
        ]);

        res.render('booking/edit', {
            number_place: number_place,
            time: time,
            customer: customer,
            booking: booking,
            title: "edit booking",
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/booking/all');
    }
}

/**
* new booking
*
* @param req
* @param res
*/
exports.new_booking = async function(req, res) {
    try {
        const customer = await Customer.findOne({CustomerID: req.body.customerID});
        
        if (!customer) {
            req.flash('error', 'Customer not found');
            return res.redirect('/booking/new');
        }

        if (!req.body.date) {
            req.flash('error', 'Date is empty');
            return res.redirect('/booking/new');
        }

        const newBooking = new Booking({
            Date: req.body.date,
            time: req.body.time,
            number_place: req.body.number_place,
            CustomerID: req.body.customerID,
            created_at: Date.now()
        });

        await newBooking.save();
        req.flash('success', 'The booking was created successfully');
        res.redirect('/booking/all');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creating booking');
        res.redirect('/booking/new');
    }
}

/**
* update booking by id
*
* @param req
* @param res
*/
exports.update_booking_by_id = async function(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/booking/edit/' + req.body.id);
        }

        const newfields = {
            CustomerID: req.body.customerID,
            Date: req.body.date,
            time: req.body.time,
            number_place: req.body.number_place,
            created_at: Date.now(),
        };

        await Booking.updateOne({_id: req.body.id}, newfields);
        req.flash('success', "The booking was updated successfully");
        res.redirect('/booking/edit/' + req.body.id);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating booking');
        res.redirect('/booking/edit/' + req.body.id);
    }
}

/**
* render booking
*
* @param req
* @param res
*/
exports.render_booking = async function(req, res) {
    const time = ["6:00am","6:30am","7:00am","7:30am","8:00am","8:30am","9:00am","9:30am","10:00am","10:30am","11:00am","11:30am","12:00pm","12:30pm","1:00pm","1:30pm","2:00pm","2:30pm","3:00pm","3:30pm","4:00pm","4:30pm","5:00pm","5:30pm","6:00pm","6:30pm","7:00pm","7:30pm","8:00pm","8:30pm","9:00pm","9:30pm","10:00pm","10:30pm","11:00pm","11:30pm"];
    const number_place = [1,2,3,4,5,6,7,8,9,10];
    
    try {
        const customer = await Customer.find({});
        res.render('booking/new', {
            customer: customer,
            number_place: number_place,
            time: time,
            title: "New booking",
            errors: req.flash('errors'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/booking/all');
    }
}

/**
* delete booking by id
*
* @param req
* @param res
*/
exports.delete_booking_by_id = async function(req, res) {
    try {
        await Booking.deleteOne({_id: req.body.id});
        req.flash('success', "The booking was deleted successfully");
        res.redirect('/booking/all');
    } catch (err) {
        console.error(err);
        req.flash('error', 'booking delete error');
        res.redirect('/booking/single/' + req.params.id);
    }
}
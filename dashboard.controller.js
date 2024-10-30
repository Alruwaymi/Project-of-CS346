/**
* call library
*/
const Customer = require('../models/Customer')
const User = require('../models/User')
const Waiter = require('../models/Waiter')
const Chef = require('../models/Chef')
const Booking = require('../models/Booking')
const Table = require('../models/Table')
const Bill = require('../models/Bill')
const Food = require('../models/Food')
const Drink = require('../models/Drink')

exports.render_dashboard_count = async function(req, res) {
    try {
        const [
            userTotal,
            waiterTotal,
            customerTotal,
            chefTotal,
            tableTotal,
            foodTotal,
            drinkTotal,
            billTotal,
            bookingTotal
        ] = await Promise.all([
            User.countDocuments({}),
            Waiter.countDocuments({}),
            Customer.countDocuments({}),
            Chef.countDocuments({}),
            Table.countDocuments({}),
            Food.countDocuments({}),
            Drink.countDocuments({}),
            Bill.countDocuments({}),
            Booking.countDocuments({})
        ]);

        res.render('dashboard/dashboard', {
            userTotal,
            waiterTotal,
            customerTotal,
            chefTotal,
            tableTotal,
            foodTotal,
            drinkTotal,
            billTotal,
            bookingTotal,
            title: "Dashboard",
            success: req.flash('success')
        });
    } catch (err) {
        console.error('Error in dashboard:', err);
        res.status(500).send('An error occurred in the control panel.');
    }
}
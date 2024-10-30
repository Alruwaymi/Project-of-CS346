const Waiter = require('../models/Waiter')
const { validationResult } = require('express-validator');

exports.new_waiter = async function(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/waiter/new')
        return
    }

    try {
        const existingWaiter = await Waiter.findOne({Email: req.body.email})
        
        if (existingWaiter) {
            req.flash('error', 'Email already exists')
            res.redirect('/waiter/new')
            return
        }

        if (req.body.birthdate === "") {
            req.flash('error', 'Date is empty')
            res.redirect('/waiter/new')
            return
        }

        const newWaiter = new Waiter({
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Email: req.body.email,
            City: req.body.city,
            Postcode: req.body.postcode,
            Salary: req.body.salary,
            Sex: req.body.sex,
            Birthdate: req.body.birthdate,
            created_at: Date.now()
        })

        await newWaiter.save()
        req.flash('success', 'The waiter was created successfully')
        res.redirect('/waiter/all')
        
    } catch (err) {
        console.log(err)
        req.flash('error', 'Error creating waiter')
        res.redirect('/waiter/new')
    }
}

exports.all_waiter = async function(req, res) {
    try {
        let page = 1
        if (req.params.page) {
            page = parseInt(req.params.page)
        }
        if (req.params.page == 0) {
            page = 1
        }
        
        const limit = 5
        const skip = limit * (page - 1)

        const totalDocs = await Waiter.countDocuments({})
        const waiters = await Waiter.find({})
            .skip(skip)
            .limit(limit)
            .sort({created_at: 'desc'})

        res.render('waiter/index', {
            waiter: waiters,
            total: totalDocs,
            page: page,
            title: "All waiter",
            success: req.flash('success')
        })
    } catch (err) {
        console.log(err)
        res.redirect('/user/new')
    }
}

exports.find_waiter_by_id = async function(req, res) {
    try {
        const waiter = await Waiter.findOne({_id: req.params.id})
        if (!waiter) {
            return res.redirect('/waiter/all')
        }
        res.render('waiter/single', {
            waiter: waiter,
            title: "single waiter"
        })
    } catch (err) {
        console.log(err)
        res.redirect('/waiter/all')
    }
}

exports.edit_waiter_by_id = async function(req, res) {
    const salary = [0,100,200,300,400,500,600,700,800,900,1000]
    const city = ['Adrar','Aïn Defla','Aïn Témouchent','Alger','Annaba','Batna','Béchar','Béjaïa','Biskra','Blida','Bordj Bou Arréridj','Bouira','Boumerdès','Chlef','ConstantineDjelfa','El Bayadh','El Oued','El Tarf','Ghardaïa','Guelma','Illizi','Jijel','Khenchela','Laghouat','MSila','Mascara','Médéa','Mila','Mostaganem','Naama','Oran','Ouargla','Oum el Bouaghi','Relizane','Saïda','Sétif','Sidi Bel Abbès','Skikda','Souk Ahras','Tamanrasset','Tébess','Tiaret','Tindouf','Tipaza','Tissemsilt','Tizi Ouzou','Tlemcen']

    try {
        const waiter = await Waiter.findOne({_id: req.params.id})
        if (!waiter) {
            return res.redirect('/waiter/all')
        }
        res.render('waiter/edit', {
            salary: salary,
            city: city,
            waiter: waiter,
            title: "edit waiter",
            errors: req.flash('errors'),
            success: req.flash('success')
        })
    } catch (err) {
        console.log(err)
        res.redirect('/waiter/all')
    }
}

exports.update_waiter_by_id = async function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/waiter/edit/' + req.body.id)
        return
    }

    try {
        const newFields = {
            Fname: req.body.firstname,
            LName: req.body.lastname,
            Email: req.body.email,
            City: req.body.city,
            Postcode: req.body.postcode,
            Salary: req.body.salary,
            Sex: req.body.sex,
            Birthdate: req.body.birthdate,
        }
        
        await Waiter.updateOne({_id: req.body.id}, newFields)
        req.flash('success', "The Waiter was updated successfully")
        res.redirect('/waiter/edit/' + req.body.id)
    } catch (err) {
        console.log(err)
        req.flash('error', 'Error updating waiter')
        res.redirect('/waiter/edit/' + req.body.id)
    }
}

exports.render_waiter = async function(req, res) {
    const city = ['Adrar','Aïn Defla','Aïn Témouchent','Alger','Annaba','Batna','Béchar','Béjaïa','Biskra','Blida','Bordj Bou Arréridj','Bouira','Boumerdès','Chlef','ConstantineDjelfa','El Bayadh','El Oued','El Tarf','Ghardaïa','Guelma','Illizi','Jijel','Khenchela','Laghouat','MSila','Mascara','Médéa','Mila','Mostaganem','Naama','Oran','Ouargla','Oum el Bouaghi','Relizane','Saïda','Sétif','Sidi Bel Abbès','Skikda','Souk Ahras','Tamanrasset','Tébess','Tiaret','Tindouf','Tipaza','Tissemsilt','Tizi Ouzou','Tlemcen']
    
    try {
        const waiters = await Waiter.find({})
        res.render('waiter/new', {
            city: city,
            waiter: waiters,
            title: "New waiter",
            errors: req.flash('errors'),
            error: req.flash('error')
        })
    } catch (err) {
        console.log(err)
        res.redirect('/waiter/all')
    }
}

exports.delete_waiter_by_id = async function(req, res) {
    try {
        await Waiter.deleteOne({_id: req.body.id})
        req.flash('success', "The waiter was deleted successfully")
        res.redirect('/waiter/all')
    } catch (err) {
        console.log(err)
        req.flash('error', 'waiter delete error')
        res.redirect('/waiter/single/' + req.params.id)
    }
}
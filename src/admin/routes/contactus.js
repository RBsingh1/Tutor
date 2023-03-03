const express = require("express")
const router = express.Router()
const ContactUs = require("../models/contactus")

//create contactUs
router.post("/contact/add", async (req, res) => {
    try {
        const contact = await new ContactUs({
            student_name: req.body.student_name,
            email: req.body.email,
            contact_no: req.body.contact_no,
            message: req.body.message,
            action: req.body.action
        })
        contact.save()
        return res.status(200).json({ success: true, data: contact })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.msg })
    }
})


//read contactus list
router.get("/contact/list", async (req, res) => {
    try {
        const contact = await ContactUs.find()
        return res.status(200).json({ success: true, data: contact })
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})

//Update Contact Us List
router.patch('/contact/update/:_id', (req, res, next) => {

    ContactUs.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});


//Delete Contact Us Document
router.delete('/contact/delete/:_id', async(req, res) => {
    const id = req.params._id;
    try {
        const contact =await ContactUs.deleteOne({ _id: id })
        return res.status(200).json({ success: true, data: contact })
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
})
module.exports = router
require('dotenv').config(); //get env variables
const { Validator } = require('node-input-validator')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/check-token');
const jwt = require('jsonwebtoken');
// const config = require('config');
const { check, validationResult } = require('express-validator');
const upload = require("../models/adminImage")

const Admin = require('../models/admin');



// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/test', auth, async (req, res) => {
  try {
    const user = await Admin.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await Admin.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, errors: [{ msg: 'Invalid Credential : email' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, errors: [{ msg: 'Invalid Credential : password' }] });
      }

      const payload = {
        user: {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_KEY,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            msg: 'Admin auth sucess!',
            token: token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


//Change Password 
router.post("/changepassword", auth, async (req, res) => {
  //  const details = await Admin.find(email)
  try {
    const password = new Validator(req.body, {
      old_password: 'required',
      new_password: 'required',
      confirm_password: 'required|same:new_password'
    })
    const matched = await password.check()
    if (!matched) {
      return res.status(401).json(password.errors)
    }

    //const user =await Admin.findOne({email:req.body.email})    when you want to change password with email
    const user = await Admin.findById(req.user.id)
    if (bcrypt.compareSync(req.body.old_password, user.password)) {

      const hashPassword = bcrypt.hashSync(req.body.new_password, 10)
      await Admin.updateOne({ _id: user._id }, { password: hashPassword })

      return res.status(200).json({ success: true, mess: "Password successfully Updated" })
    } else {
      return res.status(400).json({ success: false, mess: "Password does not matched" })
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
})


//Update Profile
router.patch("/update", auth, upload, async (req, res) => {
  const _id = req.body._id
  const Details = {
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    image: req.body.image
  }
  if (req.file) {
    Details.image = req.file.path
}
  try {
    const Data = await Admin.updateOne({ _id:_id }, {
      $set: {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        image: req.file.path,
        // image:{
        //   data:req.file.path,
        //   contentType:"image"
        // }
      },
    })
    console.log(Details)
    console.log(Data)
    return res.status(200).json({ success: true, Data })
  } catch (err) {
    return res.status(401).json({ success: false, msg: err.message })
  }
})


router.get("/get", async(req,res)=>{
  try{
    const result = await Admin.find()
    return res.status(200).json(data=result)
  }catch(err){
    return res.status(401).json(err.message)
  }
})
module.exports = router;

const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue } = require('../../db/models');

const router = express.Router()


//### Get All Venues for a Group specified by its id

// router.get('/', async(req,res,next) => {

//     const venues = await Venue.findAll({
//         include:Group
//     })
//     res.status(200).json({venues})

// })


module.exports = router;

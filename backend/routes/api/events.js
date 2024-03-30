const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue,Event} = require('../../db/models');

const router = express.Router()

router.get('/', async(req,res,next) => {
    console.log("hitting events")
    const allEvents = await Event.findAll()
    return res.json({allEvents})
})


module.exports = router;

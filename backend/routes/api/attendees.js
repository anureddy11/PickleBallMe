const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue,Event,Member,EventImages,Attendee} = require('../../db/models');
const { environment } = require('../../config');

const router = express.Router()




module.exports = router;

const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue,Event} = require('../../db/models');
const { environment } = require('../../config');

const router = express.Router()

router.get('/', async(req,res,next) => {
    const allEvents = await Event.findAll({
        include: [
            { model: User },
            { model: Group },
            { model: Venue },

        ]
    })

    console.log(allEvents)

    //find each event
    const eventArray = allEvents.map(event => ({
        id: event.id,
        name: event.name,
        venueId: event.venue_id,
        groupId: event.group_id,
        startDate: event.start_date,
        endDate: event.end_date,
        previewImage: event.previewImage,
        groupData:event.Group,
        venueData:event.Venue,

        //find # of attendees
        numAttendees: event.Users.length
    }));

    //find each event
    //for each event look up number of users through the attendess table
    //add numattendees key to the allEvents
    return res.json({eventArray})
})


module.exports = router;

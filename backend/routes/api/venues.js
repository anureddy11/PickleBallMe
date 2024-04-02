const express = require('express')
const bcrypt = require('bcryptjs')

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth,requireOrgMemAuth,checkGroup,checkMember, checkEvent } = require('../../utils/auth')
const { Group,User,GroupImage,Venue,Event,Attendee,Member} = require('../../db/models')
const group = require('../../db/models/group')
const { Model } = require('sequelize')
const venue = require('../../db/models/venue')
const { route } = require('./events')

const router = express.Router()

//middleware function to check if body has the correct credentials and password. This is used in the route handler right after
const validateVenueEdit = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    handleValidationErrors // Include handleValidationErrors middleware
];

//### Edit a Venue specified by its id
router.put('/:venueId',requireAuth,validateVenueEdit, async(req,res,next) =>{

    try{
        const {venueId} = req.params
        const venue= await Venue.findByPk(venueId) // to check if the group exits
        const  newVenueUpdates = req.body

        //find group
       const group = await Group.findByPk(venue.group_id)
       if(!group){
         return res.json("Group does not exist")
       }

        //check if organizer
        const isOrganizer = group.organizer_id === req.user.id

        // Check if the user has a membership
        const membership = await Member.findOne({
            where: {
                user_id: req.user.id,
                group_id: venue.group_id
            }
        })

        if(isOrganizer || membership.status==="co-host"){
            for(key in newVenueUpdates){
                venue[key]=newVenueUpdates[key]

            }
            await venue.save()
            res.json({
                status: "success",
                message: "Successfully edited the venue",
                venue
            })
        }else{
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer or the co-host' })
        }



    }catch (error) {
        console.error('Could not add an image:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })


module.exports = router;

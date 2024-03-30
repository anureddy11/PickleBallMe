const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue } = require('../../db/models');

const router = express.Router()

//### Edit a Venue specified by its id
router.put('/:venueId/', async(req,res,next) =>{
    console.log("venues is hit")

    try{
        const userId = req.user.id //from the middleware from session router
        const{venueId} = req.params //get the venueId from params
        const newVenueUpdates = req.body

        //find the venue
        const venue = await Venue.findByPk(venueId)


        //find the groupId of the venue
        const groupId = venue.group_id



        //find the group
        const group = await Group.findByPk(groupId)

         //find the organizerid of the group
         const organizerId = group.organizer_id

        if(userId){

            if(organizerId === userId){

                for(key in newVenueUpdates){
                    venue[key]=newVenueUpdates[key]

                }
                await venue.save()

            return res.json({
                status: "success",
                message: "Successfully edited the venue",
            });

            }else{
                next({
                    status: "unable to edit",
                    message: `userId not matching organizerId`
                });


            }
        }else{
            next({
                status: "user not found",
                message: `Please login to add image to group.`,
                details: 'group not found'
            });

        }


    }catch (error) {
        console.error('Could not add an image:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })


module.exports = router;

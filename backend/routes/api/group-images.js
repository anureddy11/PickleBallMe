const express = require('express')
const bcrypt = require('bcryptjs')
const { Op, Sequelize } = require('sequelize');

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth,requireOrgMemAuth,checkGroup,checkMember } = require('../../utils/auth')
const { Group,User,GroupImage,Venue,Event,Attendee,Member,EventImages,GroupImages} = require('../../db/models')
const group = require('../../db/models/group')
const { Model } = require('sequelize')
const venue = require('../../db/models/venue')
const { route } = require('./events')
const groupimage = require('../../db/models/groupimage')
const user = require('../../db/models/user')
const member = require('../../db/models/member')

const router = express.Router()

//delete an image from the group
router.delete('/:groupImageId',requireAuth, async (req,res,next) =>{

    const{groupImageId} = req.params
    const loggerUserId = req.user.id

    const groupImage = await GroupImage.findByPk(groupImageId)

    if(!groupImage){
        res.status(404).json({Error:"Group Image not found"})
    }

    const groupId = groupImage.group_id

    //find the group
    const group = await Group.findByPk(groupId)

     // Check if the user is the organizer
     const isOrganizer = group.organizer_id === loggerUserId
     console.log(isOrganizer)

    // Check if the user has a membership
    let membership_status = null
    const membership = await Member.findOne({
        where: {
            user_id: loggerUserId,
            group_id: groupId
        }
    })

    if(membership){
        membership_status = membership.status
    }

     // Authorization logic
     if(isOrganizer || membership_status==="co-host"){
        await groupImage.destroy();
        res.status(200).json({
            "message": "Successfully deleted image from groupImage"
          })

    }else{
        res.status(404).json({Error:"Not Authorized. Current User must already be the organizer or host "})
    }


})


module.exports = router;

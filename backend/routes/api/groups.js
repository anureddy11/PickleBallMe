const express = require('express')
const bcrypt = require('bcryptjs')

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Group,User,GroupImage,Venue,Event,Attendee,Member} = require('../../db/models')
const group = require('../../db/models/group')
const { Model } = require('sequelize')
const venue = require('../../db/models/venue')
const { route } = require('./events')

const router = express.Router()

//Authorization Middlewares
//check Group Middleware
const checkGroup = async function(req, res, next) {
    try {
        const { groupId } = req.params

        // Check if the group exists
        const group = await Group.findByPk(groupId)

        if (group) {
            return next()
        } else {
            const err = new Error('Group does not exist')
            err.title = 'Group does not exist'
            err.errors = { message: 'Group does not exist' }
            err.status = 404
            return next(err)
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        return next(error)
    }
}
//check Memeber Middleware
const checkMember = async function(req, res, next) {
    try {
        const loggedUserId = req.user.id;
        const { groupId } = req.params;
        let { memberId } = req.params || req.body;


        // Check if the user has an active membership
        const membership = await Member.findOne({
            where: {
                id:memberId
            }
        })

        if (membership) {
            return next()
        } else {
            const err = new Error('Membership does not exist')
            err.title = 'Membership does not exist'
            err.errors = { message: 'Membership does not exist' }
            err.status = 404
            return next(err)
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        return next(error)
    }
}

    //if current user is Organizer or has a membership
    const requireOrgMemAuth = async function (req, _res, next) {
        try {
            const loggedUserId = req.user.id
            const { groupId } = req.params

            // Check if the user is the organizer
            const group = await Group.findByPk(groupId)
            const isOrganizer = group.organizer_id === loggedUserId

            // Check if the user has an active membership
            const membership = await Member.findOne({
                where: {
                    user_id: loggedUserId,
                    group_id: groupId
                }
            })

            // If the user is the organizer or has a co-host membership, proceed
            if (isOrganizer || (membership && membership.status === 'co-host')) {
                return next()
            } else {
                const err = new Error('User is not the Organizer or a Co-host')
                err.title = 'Unauthorized'
                err.status = 401
                return next(err)
            }
        } catch (error) {
            // Handle any errors that occur during the database operation
            return next(error)
        }
    }




//**Members Section

//### Delete membership to a group specified by id
router.delete('/:groupId/members/:memberId',requireAuth,checkGroup,checkMember,requireOrgMemAuth, async(req,res,next)=>{
    const { groupId, memberId } = req.params
    const userId = req.user.id



    // // Find member
    const memberToDelete = await Member.findOne({
        where: {
            id:memberId
        }
    })
        await memberToDelete.destroy()
        return res.json({
            status: "success",
            message: `Successfully removed member ${memberId}`
        })
    })


//### Get all Members of a Group specified by its id
router.get('/:groupId/members',checkGroup, async(req,res,next)=> {
    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits
    console.log(groupId,group)

    //check if organizer
    const isOrganizer = group.organizer_id === req.user.id

    const memberData = await Group.findByPk(groupId,{
        include:[
            {model:User}
        ]
    })

    //check the membership status

    //selecting the fields as per the readme docs
    const members = memberData.Users.map(user => {

        //if organizer send all memeber information
        if(isOrganizer){
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    Membership: {
                        status: user.Member.status
                    }
                //else do not send member with pending status
                }
            }else{
                //send for only members where status is not pending
                if(user.Member.status!=="pending"){
                        return {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            Membership: {
                                status: user.Member.status
                            }
                        }
                }
            }
    })

    res.json(members)

} )

//### Request a Membership for a Group based on the Group's id

router.post("/:groupId/membership", requireAuth,checkMember,checkGroup, async (req,res,next) => {

    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits


    // if (!group) {
    //     return res.status(404).json({ error: 'Group not found' })
    // }

    const userId = req.user.id

    //check if user already is member
        //Query the memberdata
        const memberData = await Group.findByPk(groupId, {
            attributes: [],
            include: [{
                model: User,
                attributes: ['id'],
                through: {
                    model: Member,
                    attributes: ['user_id','status']
                }
            }]
        })

        //created an array of user ids who are memebrs
        const memberUserIdArray = []

        //array with member ids
        memberData.Users.forEach(user => {
            memberUserIdArray.push(user.Member.user_id)
        })
        //reject memebership if already exists
        if (memberUserIdArray.includes(userId)) {
            return res.status(404).json({ error: 'User Already a Member or has request pending' })
        }

        const newMemberData = await Member.create({
            user_id:userId,
            group_id:groupId,
            status: "pending"
        })
        res.json({
            status: "success",
            message: "Pending Request",
            newMemberData
        })



})

//### Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth,requireOrgMemAuth, async(req,res,next) => {

    const { groupId } = req.params
    const { memberId, status } = req.body
    const userId = req.user.id

    // Check if the group exists
    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({ error: 'Group not found' })
    }

    // Check if the user is the organizer
    const isOrganizer = group.organizer_id === userId

    // Check if the user has a membership
    const membership = await Member.findOne({
        where: {
            user_id: userId,
            group_id: groupId
        }
    })

     // find the membership to update
     const memberToUpdate = await Member.findOne({
        where: {
            id:memberId
        }
    })


    if (!memberToUpdate) {
        return res.status(404).json({ error: "Membership between the user and the group does not exist" })
    }

    // Authorization logic
    if (status === 'co-host') {
        if (!isOrganizer) {
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer to change to co-host' })
        }
        memberToUpdate.status = 'co-host'
    } else if (status === 'member') {
        memberToUpdate.status = 'member'

    } else if (status === 'pending') {
        return res.status(400).json({ error: 'Cannot change to pending from pending' })
    } else {
        return res.status(400).json({ error: 'Invalid status' })
    }

    // Save the updated member status
    await memberToUpdate.save()

    res.json({ status: 'success', message: 'Membership status updated successfully' })


})





//**Events Section
//### Get all Events of a Group specified by its id

router.get('/:groupId/events' ,async(req,res,next)=>{

    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits
    console.log(groupId,group)

    if (!group) {
        return res.status(404).json({ error: 'Group not found' })
    }

    const eventData = await Event.findAll({
        where: { group_id: groupId },
        include: [
            {
                model: Venue
            },
            {
                model: User,
                attributes: []
            }
        ],
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('Users.id')), 'numAttendees']
        ],
        group: ['Event.id', 'Venue.id'] // Grouping by Event and Venue to avoid duplications
    })



    if (!eventData) {
        return res.status(404).json({ error: 'Event not found' })
    }

    return res.json({
        status: "success",
        eventData,
    })



        })


//### Create an Event for a Group specified by its id
router.post('/:groupId/events',requireAuth,async(req,res,next) => {
    let newEventData = req.body
    const {groupId} = req.params

    //find the group
    const group= await Group.findByPk(groupId) // to check if the group exits
    if (!group) {
        return res.status(404).json({ error: 'Group not found' })
    }

    //check if organizer
    const isOrganizer = group.organizer_id === req.user.id

    // check if co-host
    const membership = await Member.findOne({
        where: {
            user_id: req.user.id,   // User ID
            group_id: groupId  // Group ID
        }
    })

    //adding data to the events table
   if(isOrganizer || membership.status==='active'){

            //check if the venueId inserted has the group associated to it
            const insertedVenueId = newEventData.venueId
            const venueDate = await Venue.findByPk(insertedVenueId)
            if(venueDate.group_id!==groupId){
                return res.status(404).json({ error: 'Venue is not associated with this group' })
            }


            try {
                // Attempt to create a new event
                const newEvent = await Event.create({
                    group_id:groupId,
                    venue_id: newEventData.venueId,
                    name: newEventData.name,
                    type: newEventData.type,
                    capacity: newEventData.capacity,
                    price: newEventData.price,
                    description: newEventData.description,
                    start_date: newEventData.startDate,
                    end_date: newEventData.endDate
                })

                // If event creation is successful, respond with success message
                res.json({
                    status: "success",
                    message: `Successfully created new event for group ${groupId}`,
                })
            } catch (error) {
                // If an error occurs during event creation, log the error and respond with status code 400
                console.error('Error creating event :', error)
                res.status(400)
            }

   }else{
    return res.json({
        message: `Not Authorized since not a Cohost or the Organizer`,
    })
   }

})




//**Venues Section
// ### Get All Venues for a Group specified by its id

router.get('/:groupId/venues', async(req,res,next) =>{
    try{
        const {groupId} = req.params


        if(groupId){

            const venues = await Venue.findAll(
                {
                    where:{group_id:groupId}
                }
            )

         res.status(200).json({ venues })
         return

        }else{
            next({
                status: 404, //  HTTP status code for 'Not Found'
                message: `Could not find group ${groupId}`,
                details: 'group not found'
            })
        }

    }catch (error) {
        console.error('Error fetching venue data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
})



//### Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', async(req,res) => {

    try{
        const {groupId} = req.params
        const group= await Group.findByPk(groupId) // to check if the group exits
        const  newVenueData = req.body
        if(group){


            const newVenue = await Venue.create({group_id:groupId, address:newVenueData.address, city:newVenueData.city, state:newVenueData.state, lat:newVenueData.lat, lng: newVenueData.lng,name:newVenueData.name})
            res.json({
                status: "success",
                message: "Successfully created new group",
            })
        }else{
            next({
                status: "new venue not added",
                message: `groupId not found`
            })
        }



    }catch{
        console.error('Error creating venue :', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }

})

//### Edit a Venue specified by its id




//Groups Only Section
//Returns all groups
router.get('/', async(req,res) => {

    const groups = await Group.findAll()

    return res.json({groups})
})


//Edit a group
router.put('/:id', async(req,res,next) => {
    try {
        // Your code here
        let updates = req.body
        let {id} = req.params
        let {organizer_id,name,about,type,private,city,state} = updates

        const groupToUpdate = await Group.findOne({
            where:{
                id:id
            }
        })



        if (groupToUpdate) {
            // Update only the fields that exist in the updates object
            for (const key in updates) {
                if (updates.hasOwnProperty(key)) {
                    groupToUpdate[key] = updates[key]
                }
            }

            await groupToUpdate.save()

            return res.json({
                data: id,
                status: "success",
                message: `Successfully updated group`,
            })
        }

        else{

            next({
                status: "not-found",
                message: `Could not update group ${id}`,
                details: 'group not found'
            })

        }



    } catch (error) {
        console.error('Error fetching group data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }

})


//Deletes a group
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedGroup = await Group.destroy({
            where: { id: req.params.id }
        })

        // Check if the group was found and deleted
        if (deletedGroup === 0) {
            // If not found, send a not-found error response
            return next({
                status: "not-found",
                message: `Could not remove Group ${req.params.id}`,
                details: "Group not found"
            })
        }

        return res.json({
            status: "success",
            message: `Successfully removed Group ${req.params.id}`,
        })
    } catch (error) {
        console.error('Error deleting data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
})


//Add a new group
router.post('/', async (req, res, next) => {

    try {
        const group = req.body
        const newGroup = await Group.create({organizer_id:group.organizer_id, name:group.name, about:group.about, type:group.type, private:group.private, city:group.city, state: group.state})
        return res.json({
            status: "success",
            message: "Successfully created new group",
        })
    } catch(err) {
        next({
            status: "error",
            message: 'Could not create new group',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        })
    }
})


// Get all Groups joined or organized by the Current User
router.get('/current', async(req,res,next) =>{

    try{
        const userId = req.user.id //from the middleware from session router

        const joinedGroups = await User.findAll({

            where: { id: userId },
            include: {
                model:Group
            }

        })
        res.status(200).json({ joinedGroups })


    }catch (error) {
        console.error('Error fetching groups:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }


})

//Add an Image to a Group based on the Group's id

router.post('/:groupId/images', async(req,res,next) =>{

    try{
        const userId = req.user.id //from the middleware from session router
        const{groupId} = req.params //get the groupId from params
        const newGroupImageData = req.body

        //find the group
        const group = await Group.findByPk(groupId)

        //find the organizerid of the group

        const organizerId = group.organizer_id
        //if organizerid matches the userid then add image

        if(userId){

            if(organizerId === userId){

            const newGroupImage = await GroupImage.create({
                preview_image:newGroupImageData.preview_image,
                image_url:newGroupImageData.image_url,
                group_id:groupId,
            })
            return res.json({
                status: "success",
                message: "Successfully created new groupimage",
                newGroupImage
            })

            }else{
                next({
                    status: "new Image not added",
                    message: `userId not matching organizerId`
                })


            }
        }else{
            next({
                status: "user not found",
                message: `Please login to add image to group.`,
                details: 'group not found'
            })

        }


    }catch (error) {
        console.error('Could not add an image:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
})


// Get details of a Group from a groupid

router.get('/:id', async(req,res,next) =>{
    try{
        const {id}=req.params
        const group = await Group.findByPk(id)
        if(id){
            return res.json({
                data: id,
                status: "success",
                message: `Successfully updated group`,
                group
            })
        }else{
            next({
                status: "not-found",
                message: `Could not find group ${id}`,
                details: 'group not found'
            })

        }

    }catch (error) {
        console.error('Error fetching group data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }

})



module.exports = router

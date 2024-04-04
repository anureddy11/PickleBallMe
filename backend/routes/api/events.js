const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth,requireOrgMemAuth,checkGroup,checkEvent } = require('../../utils/auth');
const { Group,User,GroupImage,Venue,Event,Member,EventImages,Attendee} = require('../../db/models');
const { environment } = require('../../config');

const router = express.Router()

//**Attendees Section

//Request to Attend an Event based on the Event's id
//Question to Philip: Should we allow users to request attendance for the events which are part of groups that the user is not a member of?

router.post("/:eventId/attendance", requireAuth, async (req,res,next) => {

    const {eventId} = req.params
    const event= await Event.findByPk(eventId) // to check if the group exits
    const {userId,status}= req.body

    if(!userId){
        return res.status(404).json({ error: 'Request does not contain valid userId' });
    }

    if(status!=="pending"){
        return res.status(404).json({ error: 'Request does not contain valid status' });
    }


    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    const loggedUserId = req.user.id

     //Get the group of the event
     const groupId = event.group_id
     const group = await Group.findByPk(groupId)
     if (!group) {
         return res.status(404).json({ error: 'Group not found' });
     }

    //check if organizer
    const isOrganizer = group.organizer_id === loggedUserId

        //Check if the the attendee already exists
        const attendeeDate = await Attendee.findOne({

            where:{
                event_id:eventId,
                user_id:userId

            }
        }
        )

    // Check if the user has a membership
    const userAuth = await Member.findOne({
        where: {
            user_id: loggedUserId,
            group_id: groupId
        }
    })
     //Loggeed in user membership status to the Group
     let userStatus = undefined

     if(userAuth){
         userStatus = userAuth.status
     }

        if(attendeeDate){
            return res.status(404).json({ error: 'User Already an attendee' });
        }else{
            //check if the logged in user is orgnizr or member of the event's group (need to ask Philip a question here about need for loggedin user authorization)
            //adding new attendee data
                const newAttendeeData = await Attendee.create({
                    user_id:userId,
                    event_id:eventId,
                    status: "pending"
                })
                res.json({
                    status: "success",
                    message: "Pending Request",
                    newAttendeeData
                })
            }





})

//##Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req,res,next) => {

    const { eventId } = req.params;

    const { userId, status } = req.body;
    const loggedUserId = req.user.id;

    // Check if the event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }



    //Get the group of the event
    const groupId = event.group_id
    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }



    //check if organizer
    const isOrganizer = group.organizer_id === loggedUserId



    // Check if the user has a membership
    const userAuth = await Member.findOne({
        where: {
            user_id: loggedUserId,
            group_id: groupId
        }
    })
     //Loggeed in user membership status to the Group
     let userStatus = undefined

     if(userAuth){
         userStatus = userAuth.status
     }


    // Check if the userId is an attendee
    const attendeeToUpdate = await Attendee.findOne({
        where: {
            user_id: userId,
            event_id: eventId
        }
    });

    if (!attendeeToUpdate ) {
        return res.status(404).json({ error: "Attendee not found" });
    }


    // Authorization logic
    if (status === 'attending') {
        if (!isOrganizer || userStatus ==="co-host") {
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer to change to attending' });
        }
        else if(attendeeToUpdate.status ==="attending"){
            return res.status(404).json({ error: 'Status is already attending' });

        }else{
            attendeeToUpdate.status = 'attending';
        }

    } else if (status === 'pending') {
        return res.status(400).json({ error: 'Cannot change to pending from pending' });

    } else {
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Save the updated attendee status
    await attendeeToUpdate.save();

    res.json({ status: 'success', message: 'Attendance status updated successfully' });


})

//### Delete attendance to an event specified by id

router.delete('/:eventId/attendance/:userId', requireAuth, async(req,res,next)=>{
    const { eventId, userId } = req.params;
    const loggedUserId = req.user.id;

    // Check if the event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    const groupId = event.group_id
    const group = await Group.findByPk(groupId);


    // Check if the user is the organizer
    const isOrganizer = group.organizer_id === loggedUserId;


    // Check if the user has a membership
    const userAuth = await Member.findOne({
        where: {
            user_id: loggedUserId,
            group_id: groupId
        }
    })
    //Loggeed in user membership status to the Group
    let loggedUserStatus = undefined
    if(userAuth){
        loggedUserStatus = userAuth.status
    }

    // Check if the attendee exists
    const attendeeToDelete = await Attendee.findOne({
        where: {
            user_id:userId,
            event_id:eventId
        }
    })
    if(!attendeeToDelete){
        return res.status(404).json({ error: 'Attendee not found' });
    }
    console.log(isOrganizer,loggedUserStatus)

    if(isOrganizer || loggedUserStatus ==="co-host"){
        await attendeeToDelete.destroy();
        return res.json({
            status: "success",
            message: 'Successfully removed attendee'
        });
    } else {
        return res.status(403).json({ error: 'Not Authorized' });
    }
});



//### Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees',async(req,res,next)=> {
    const {eventId} = req.params
    const userId=req.user.id
    const event= await Event.findByPk(eventId) // to check if the event exits
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    //Get the group of the event
    const groupId = event.group_id
    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }

    //check if organizer
    const isOrganizer = group.organizer_id === req.user.id

    // Check if the user has a membership
    const userAuth = await Member.findOne({
        where: {
            user_id: userId,
            group_id: groupId
        }
    })
     //Loggeed in user membership status to the Group
     let status = undefined
     if(userAuth){
         status = userAuth.status
     }


    const attendeeData = await Event.findByPk(eventId,{
        include:[
            {model:User}
        ]
    })


    //selecting the fields as per the readme docs
    const attendees = attendeeData.Users.map(user => {

        //if organizer send all memeber information
        if(isOrganizer){
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    attendeStatus: {
                        status: user.Attendee.status
                    }
                //else do not send member with pending status
                };
            }else{
                //send for only members where status is not pending
                if(user.Attendee.status!=="pending"){
                        return {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            Membership: {
                                status: user.Attendee.status
                            }
                        }
                }
            }
    });

    res.json(attendees)

} )


//** Event Images Sections
//### Add an Image to an Event based on the Event's id
router.post('/:eventId/images',requireAuth, async(req,res,next) =>{

    const {eventId} =req.params
    const {eventImageData} = req.body;

    console.log(eventImageData)

    //find the event
    const event = await Event.findByPk(eventId)
    if(!event){
        return res.status(404).json({ error: 'Event not found' });
    }

    //find group
    const groupId= event.group_id


      // Check if the user has a membership
      const membership = await Member.findOne({
        where: {
            user_id: req.user.id,
            group_id: groupId
        }
    })
    let membership_status =null
    if(membership){
        membership_status=membership.status
    }


    //check if attendee
    const attendance = await Attendee.findAll({
        where: { event_id: eventId }
    })

    if(attendance || membership_status ==="co-host" || membership_status ==="host"){
        const newEventImage = await EventImages.create({

                preview_image: eventImageData.preview,
                image_url: eventImageData.url,
                event_id:eventId

            })
        return res.status(200).res.json(newEventImage)
    }else{
        return res.status(403).json({ error: 'Not Authorized. Need to be attending or the host or the co-host' })
    }


})



//Get all Events
router.get('/', async(req,res,next) => {
    const allEvents = await Event.findAll({
        include: [
            { model: User },
            { model: Group },
            {
                model: EventImages,
                attributes: ['image_url']
            },
            { model: Venue },
        ]
    })

    if (!allEvents) {
        return res.status(404).json({ error: 'Event not found' })
    }

    //find each event
    const Events= allEvents.map(event => ({
        id: event.id,
        name: event.name,
        venueId: event.venue_id,
        groupId: event.group_id,
        startDate: event.start_date,
        endDate: event.end_date,
        previewImages: event.previewImage,
        Group:{
            id:event.Group.id,
            name:event.Group.name,
            city:event.Group.city,
            State:event.Group.state
            },
        Venue:{
            id:event.Venue.id,
            city:event.Venue.city,
            state:event.Venue.state

        },
        previewImages: event.EventImages[0].image_url,



        //find # of attendees
        numAttendees: event.Users.length
    }));

    //find each event
    //for each event look up number of users through the attendess table
    //add numattendees key to the allEvents
    return res.json({Events})
})

//### Get details of an Event specified by its id

router.get("/:eventId", async(req,res,next)=>{

    const{eventId} = req.params
    const myEvent = await Event.findByPk(eventId, {
        include: [
            { model: User },
            { model: Group },
            { model: Venue },
            { model: EventImages}

        ]
    });

    if (!myEvent) {
        return res.status(404).json({ error: 'Event not found' });
    }

    // Calculate the number of attendees
    const numAttendees = myEvent.Users.length;

    // Add the calculated number of attendees to myEvent object
    myEvent.dataValues.numAttendees = numAttendees;

    const output= {
        id: myEvent.id,
        name: myEvent.name,
        venueId: myEvent.venue_id,
        groupId: myEvent.group_id,
        startDate: myEvent.start_date,
        endDate: myEvent.end_date,
        Group:{
            id:myEvent.Group.id,
            name:myEvent.Group.name,
            city:myEvent.Group.city,
            State:myEvent.Group.state
            },
        Venue:{
            id:myEvent.Venue.id,
            city:myEvent.Venue.city,
            state:myEvent.Venue.state

        },
        EventImages: myEvent.EventImages.map(image => ({
            id: image.id,
            url: image.image_url,
            preview:image.preview_image
        })),




        //find # of attendees
        numAttendees: myEvent.Users.length
    }

    return res.status(200).json(output)
})



//Delete an Event specified by its id
router.delete('/:eventId',requireAuth, async(req,res,next) =>{


    let isCoHost = false

    //check for the user
    const userId = req.user.id

    //find the group of the event
    const {eventId} = req.params
    const eventData = await Event.findByPk(eventId,{
        include: [
            { model:Group,
              include:[
                {
                    model: User, // Include User table
                }


              ]
                 },
        ]
    })

    if (!eventData) {
        return res.status(404).json({ error: 'Event not found' });
    }

    //check if organizer
    const isOrganizer = eventData.Group.organizer_id === userId

    //check if coHost
    const users = eventData.Group.Users
    let isCohost
    for (let i=0;i<users.length;i++){
        if(users[i].Member.user_id===userId && users[i].Member.status === 'active'){ //need to change active to cohost
            isCoHost=true

        }

    }

    //deleting the group if checks pass

    if(isCoHost || isOrganizer){
        const deleteEvent = await Event.destroy({
            where: {id:eventId}
        })
    }else{
        return res.json({
            message: `Not Authorized since not a Cohost or Organizer`,
        });

    }

    return res.json({
        status: "success",
        message: `Successfully removed Event ${eventId}`,
    });


})

//### Edit an Event specified by its id
router.put('/:eventId',requireAuth, async(req,res,next) =>{


    let isCoHost = false

    //check for the user
    const userId = req.user.id

    //data from body
    let updates = req.body

    //check for venue data
    if (updates.venue_id) {
          const venue = await Venue.findByPk(updates.venue_id);
          if (!venue) {
            return res.status(400).json({ error: 'Venue does not exist.' });
          }
    }

    //find the group of the event
    const {eventId} = req.params
    const eventData = await Event.findByPk(eventId,{
        include: [
            { model:Group,
              include:[
                {
                    model: User, // Include User table
                }


              ]
                 },
        ]
    })

    if (!eventData) {
        return res.status(404).json({ error: 'Event not found' });
    }

    //check if organizer
    const isOrganizer = eventData.Group.organizer_id === userId

    //check if coHost
    const users = eventData.Group.Users
    let isCohost
    for (let i=0;i<users.length;i++){
        if(users[i].Member.user_id===userId && users[i].Member.status === 'active'){ //need to change active to cohost
            isCoHost=true

        }

    }

 // Check if the user is a co-host or organizer
if (isCoHost || isOrganizer) {
    // Fetch the event to update

    const eventToUpdate = await Event.findByPk(eventId);

    try {
        // Update the event with the provided updates
        for (const key in updates) {
            eventToUpdate[key] = updates[key];
        }
        await eventToUpdate.save();

        // Return a success response
        return res.json({ message: 'Event updated successfully',eventToUpdate });

    } catch (error) {

        // Handle validation errors
        console.error( error);
        return res.status(400).json({ error: 'Check your input data.' });
    }
} else {
    // Return an error response if the user is not authorized
    return res.status(403).json({ error: 'Not authorized. Only co-hosts or organizers can edit the event.' });
}

})




module.exports = router;

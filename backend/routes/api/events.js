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
    const {userId,save}= req.body


    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    const loogedUserId = req.user.id

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
    console.log(eventId,req.user.id)

    //check if the user is attending the event
    try {
        // Check if the user is an attendee of the event
        const attendee = await Attendee.findOne({
            where: {
                user_id: req.user.id,
                event_id: eventId
            }
        });

        if (attendee) {
            // If the user is an attendee, create a new event image
            const eventImageData = req.body;
            const newEventImage = await EventImages.create({
                preview_image: eventImageData.preview,
                image_url: eventImageData.url
            });

            // Respond with success message and the newly created event image
            res.json({
                status: "success",
                message: "Successfully created new event image",
                newEventImage
            });
        } else {
            // If the user is not an attendee, respond with a message indicating so
            return res.json({
                message: "User is not an attendee of this event"
            });
        }
    } catch (error) {
          // Log the error for debugging purposes
    console.error("Error creating event image:", error);

    // Respond with a 500 status code and a detailed error message
    res.status(500).json({
        error: "An error occurred while creating the event image",
        details: error.message // Include the error message for debugging
    });
    }

    //add the image and return image data

    //throw error if the id is not linked to the event

})



//Get all Events
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

    return res.json({myEvent})
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

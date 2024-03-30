const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue,Event,Member} = require('../../db/models');
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

//### Get details of an Event specified by its id

router.get("/:eventId", async(req,res,next)=>{

    const{eventId} = req.params
    const myEvent = await Event.findByPk(eventId, {
        include: [
            { model: User },
            { model: Group },
            { model: Venue },

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

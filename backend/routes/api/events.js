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

router.post("/:eventId/attendance", requireAuth, async (req,res,next) => {
    const {eventId} = req.params
    const event = await Event.findByPk(eventId)
    const userId = req.user.id

    if(!event){
        res.status(404).json({"message":"event not found"})
    }

        //check if user already is an attendee
        //Query the attendee data
        const attendeeData = await Event.findByPk(eventId, {
            attributes: [],
            include: [{
                model: User,
                attributes: ['id'],
                through: {
                    model: Attendee,
                    attributes: ['user_id','status']
                }
            }]
        })

        let pendingRequest = false;
        let isAttendee = false;

        // Check if pending membership or already a member
        const checkAttendee = attendeeData.toJSON();
        checkAttendee.Users.forEach(attendee => {
            if (attendee.id === userId) {
                if (attendee.Attendee.status === "pending") {
                    pendingRequest = true;
                } else {
                    isAttendee = true;
                }
            }
        });

        if (pendingRequest) {
            res.status(400).json({"message":"Request Pending"});
        }
        if (isAttendee) {
            res.status(400).json({"message":"Already an attendee"});
        }

            //adding new attendee data
                const newAttendeeData = await Attendee.create({
                    user_id:userId,
                    event_id:eventId,
                    status: "pending"
                })

        const newAttendeeDataForOutput = newAttendeeData.toJSON()

        const respose ={
            userId:newAttendeeDataForOutput.user_id,
            status:newAttendeeDataForOutput.status
        }

            return res.status(201).json(respose)


})

//##Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req,res,next) => {

    const { eventId } = req.params
    const { userId, status } = req.body
    const loggerUserId = req.user.id

    // Check if the event exists
    const event = await Event.findByPk(eventId)
    if(!event){
        res.status(404).json({"message": "Event couldn't be found"})
    }


    const groupId = event.group_id
    // Check if the group exists
    const group = await Group.findByPk(groupId)

        // find the membership to update
        const attendanceToUpdate = await Attendee.findOne({
            where: {
                user_id:userId,
                event_id: eventId
            }
        })

        if (!attendanceToUpdate) {
            return res.status(404).json({ "message": "Attendance between the user and the event does not exist" })
        }


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

        if (status === 'pending') {
            res.status(400).json({
                "message": "Bad Request",
                "errors": {
                    "status": "Cannot change an attendance status to pending"
                }
            });
        } else {
            if (isOrganizer || membership_status==="co-host") {
                attendanceToUpdate.status = status;
                await attendanceToUpdate.save();
                const output = {
                    id: attendanceToUpdate.id,
                    userId: attendanceToUpdate.user_id,
                    status: attendanceToUpdate.status
                };
                res.status(200).json(output);
            } else {
                res.status(404).json({error: "Not Authorized. Current User must already be the organizer or co-host "});
        }
    }

    })

//### Delete attendance to an event specified by id

router.delete('/:eventId/attendance/:userId', requireAuth, async(req,res,next)=>{

    const { eventId,userId } = req.params
    const loggerUserId = req.user.id

    // Check if the event exists
    const event = await Event.findByPk(eventId)
    if(!event){
        res.status(404).json({"message": "Event couldn't be found"})
    }


    const groupId = event.group_id
    // Check if the group exists
    const group = await Group.findByPk(groupId)

        // find the membership to update
        const attendeeToDelete = await Attendee.findOne({
            where: {
                user_id:userId,
                event_id: eventId
            }
        })

        if (!attendeeToDelete) {
            return res.status(404).json({ "message": "Attendance between the user and the event does not exist" })
        }


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
            if(isOrganizer || membership_status==="host" || userId===loggerUserId){
                await attendeeToDelete.destroy();
                res.status(200).json({
                    "message": "Successfully deleted attendance from event"
                  })

            }else{
                res.status(404).json({error:"Not Authorized. Current User must already be the organizer or host "})
            }


})






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
                    Attendance: {
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



    //find the event
    const event = await Event.findByPk(eventId)
    if(!event){
        return res.status(404).json({ "message": 'Event not found' });
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
    let attendance_status=null
    const attendance = await Attendee.findOne({
        where: {
            user_id: req.user.id,
            event_id: eventId }
    })

    if(attendance){
        attendance_status=attendance.toJSON().status
    }
    console.log(attendance_status,membership_status)

    if( attendance_status || membership_status ==="co-host" || membership_status ==="host"){
        const newEventImage = await EventImages.create({

                preview_image: req.body.preview,
                image_url: req.body.url,
                event_id:eventId

            })
        let output ={
            id:newEventImage.id,
            url:newEventImage.image_url,
            preview:newEventImage.preview_image
        }
        return res.status(201).json(output)
    }else{
        return res.status(403).json({ "message": 'Not Authorized. Need to be attending or the host or the co-host' })
    }


})



//Get all Events
router.get('/', async(req,res,next) => {

    //pagination section

    let {page,size,name,type,startDate} = req.query
    console.log(req)
    // console.log(page,size,name,type,startDate)

    if (isNaN(page) || page < 1){
        page = 1
        errors: [
            { message: 'Page must be greater than or equal to 1' }
          ]
    }
    if (isNaN(size) || size < 1) {
        size = 20;
        errors: [
            { message: 'Size must be between 1 and 20' }
          ]
    }

    if (size > 20) {
        size = 20;
        errors: [
            { message: 'Size must be between 1 and 20' }
          ]
    }

    const where = {};
    const pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    if (name && name !== '') {
        where.name = name
      } else if (name === '') {
        res.status(400);
        return res.json({
          errors: [
            { message: 'name filter should not be empty' }
          ]
        });
      }

      if (type && type !== '') {
        where.type = type
      } else if (type === '') {
        res.status(400);
        return res.json({
          errors: [
            { message: 'type filter should not be empty' }
          ]
        });
      }

      if (startDate && startDate !== '') {
        where.startDate = startDate
      } else if (startDate === '') {
        res.status(400);
        return res.json({
          errors: [
            { message: 'startDate filter should not be empty' }
          ]
        });
      }

      console.log(where)


    //query
    const allEvents = await Event.findAll({
        where,
        ...pagination,
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
        price:event.price,
        venueId: event.venue_id,
        groupId: event.group_id,
        startDate: new Date(event.start_date).toLocaleString(),
        endDate: new Date(event.end_date).toLocaleString(),
        preview:event.preview_image,
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
        // previewImages: event.EventImages[0].image_url,



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
        price: parseFloat((myEvent.price).toFixed(2)),
        venueId: myEvent.venue_id,
        groupId: myEvent.group_id,
        startDate: new Date(myEvent.start_date).toLocaleString(),
        endDate: new Date(myEvent.end_date).toLocaleString(),
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

    console.log(output)

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
        return res.status(404).json({ "message": 'Event not found' });
    }

    //check if organizer
    const isOrganizer = eventData.Group.organizer_id === userId

    //check if coHost
    const users = eventData.Group.Users
    let isCohost
    for (let i=0;i<users.length;i++){
        if(users[i].Member.user_id===userId && users[i].Member.status === 'co-host'){ //need to change active to cohost
            isCoHost=true

        }

    }

    //deleting the group if checks pass

    if(isCoHost || isOrganizer){
        const deleteEvent = await Event.destroy({
            where: {id:eventId}
        })
        return res.status(200).json("Successfully deleted");
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


//middleware function to check if body has the correct credentials and password. This is used in the route handler right after
const validateEventBody = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['Online', 'In person'])
        .withMessage('Type must be either Online or In person'),
    check('capacity')
        .notEmpty()
        .withMessage('Capacity is required')
        .isInt({ min: 1 })
        .withMessage('Capacity must be a positive integer'),
    check('price')
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage('Price must be a positive number'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .custom((value, { req }) => {
            const startDate = new Date(value);
            const currentDate = new Date();
            return startDate > currentDate;
        })
        .withMessage('Start date must be in the future'),
    check('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);
            return endDate > startDate;
        })
        .withMessage('End date must be after start date'),
        handleValidationErrors
]

//### Edit an Event specified by its id
router.put('/:eventId',requireAuth, validateEventBody,async(req,res,next) =>{


    let isCoHost = false

    //check for the user
    const userId = req.user.id

    //data from body
    let updates = req.body

    //check for venue data
    if (updates.venueId) {
          const venue = await Venue.findByPk(updates.venueId)
          if (!venue) {
            return res.status(400).json({ "message": 'Venue does not exist.' });
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
        return res.status(404).json({ "message": 'Event not found' });
    }

    //check if organizer
    const isOrganizer = eventData.Group.organizer_id === userId

    //check if coHost
    const users = eventData.Group.Users
    let isCohost
    for (let i=0;i<users.length;i++){
        if(users[i].Member.user_id===userId && users[i].Member.status === 'co-host'){ //need to change active to cohost
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
        //since formar of venueId is different addign this change manuallu
        eventToUpdate["venue_id"]=updates["venueId"]
        await eventToUpdate.save();

       let output={
        venueId:eventToUpdate.venue_id,
        name:eventToUpdate.name,
        type:eventToUpdate.type,
        capacity:eventToUpdate.capacity,
        price:eventToUpdate.price,
        description:eventToUpdate.description,
        startDate:eventToUpdate.startDate,
        endDate:eventToUpdate.endDate
       }
       return res.status(200).json(output)


    } catch (error) {

        // Handle validation errors
        console.error( error);
        return res.status(400).json({ "message": 'Check your input data.' });
    }
} else {
    // Return an error response if the user is not authorized
    return res.status(403).json({ "message": 'Not authorized. Only co-hosts or organizers can edit the event.' });
}

})




module.exports = router;

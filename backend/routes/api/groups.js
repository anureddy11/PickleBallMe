const express = require('express')
const bcrypt = require('bcryptjs')
const { Op, Sequelize } = require('sequelize');

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth,requireOrgMemAuth,checkGroup,checkMember } = require('../../utils/auth')
const { Group,User,GroupImage,Venue,Event,Attendee,Member,EventImages} = require('../../db/models')
const group = require('../../db/models/group')
const { Model } = require('sequelize')
const venue = require('../../db/models/venue')
const { route } = require('./events')
const groupimage = require('../../db/models/groupimage')
const user = require('../../db/models/user')
const member = require('../../db/models/member')

const router = express.Router()

const { environment } = require('../../config');
const isProduction = environment === 'production';





//**Members Section

//### Delete membership to a group specified by id
router.delete('/:groupId/membership/:memberId',requireAuth,checkGroup,checkMember, async(req,res,next)=>{
    const { groupId, memberId } = req.params
    const userId = req.user.id

    // // Find member
    const memberToDelete = await Member.findOne({
        where: {
            user_id:memberId,
            group_id:groupId
        }
    })


     // Check if the user has a membership
     let membership_status = null
     const membership = await Member.findOne({
         where: {
             user_id: userId,
             group_id: groupId
         }
     })

     if(membership){
         membership_status = membership.status
     }

     if(membership_status==="host" || memberToDelete.user_id===userId){
            await memberToDelete.destroy()
            return res.status(200).json( {"message": "Successfully deleted membership from group"})
     }else{
        return res.status(404).json({"message":"Not the host"})

     }
    })


//### Get all Members of a Group specified by its id
router.get('/:groupId/members',checkGroup, async(req,res,next)=> {
    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits


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

router.post("/:groupId/membership", requireAuth,checkGroup, async (req,res,next) => {

    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits


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

        let pendingRequest = false;
        let isMember = false;

        // Check if pending membership or already a member
        const checkMember = memberData.toJSON();
        checkMember.Users.forEach(member => {
            if (member.id === userId) {
                if (member.Member.status === "pending") {
                    pendingRequest = true;
                } else {
                    isMember = true;
                }
            }
        });

        if (pendingRequest) {
            return res.status(400).json({"message":"Request Pending"});
        }
        if (isMember) {
            return res.status(400).json({"message":"Already a member"});
        }



        const newMemberData = await Member.create({
            user_id:userId,
            group_id:groupId,
            status: "pending"
        })

        const response = {
            memberId: newMemberData.dataValues.user_id,
            status: newMemberData.dataValues.status
        };
        return res.status(201).json(response)



})

//### Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth,checkGroup, async(req,res,next) => {

    const { groupId } = req.params
    const { memberId, status } = req.body
    const userId = req.user.id

    // Check if the group exists
    const group = await Group.findByPk(groupId)


    // Check if the user is the organizer
    const isOrganizer = group.organizer_id === userId

    // Check if the user has a membership
    let membership_status = null
    const membership = await Member.findOne({
        where: {
            user_id: userId,
            group_id: groupId
        }
    })

    if(membership){
        membership_status = membership.status
    }

     // find the membership to update
     const memberToUpdate = await Member.findOne({
        where: {
            user_id:memberId,
            group_id: groupId

        }
    })


    if (!memberToUpdate) {
        return res.status(404).json({ error: "Membership between the user and the group does not exist" })
    }

    console.log(isOrganizer,membership_status,status)

    // Authorization logic
        if (status === 'co-host') {
            if(isOrganizer){

                memberToUpdate.status = 'co-host'
                await memberToUpdate.save()
                res.status(200).json({"message":"Membership successfully updated"})

            }else{
                res.status(404).json("Not Authorized. Current User must already be the organizer ")
            }

        } else if (status === 'member') {
            if(membership_status==="co-host" || isOrganizer){
                memberToUpdate.status = 'member'
                await memberToUpdate.save()
                res.status(200).json({"message":"Membership successfully updated"})
            }else{
                res.status(404).json("Not Authorized. Current User must already be the organizer or the co-host ")
            }

        } else {
            return res.status(400).json({ error: 'Invalid memebership status' })
        }


})





//**Events Section
//### Get all Events of a Group specified by its id

router.get('/:groupId/events',checkGroup,async(req,res,next)=>{

    const {groupId} = req.params
    const group= await Group.findByPk(groupId) // to check if the group exits
    console.log(groupId,group)

    if (!group) {
        return res.status(404).json({ error: 'Group not found' })
    }

    const allEvents = await Event.findAll({
        where:{group_id:groupId},
        include: [
            { model: User },
            { model: Group },
            {model: EventImages},
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



        //find # of attendees
        numAttendees: event.Users.length
    }));

    //find each event
    //for each event look up number of users through the attendess table
    //add numattendees key to the allEvents
    return res.status(200).json({Events})



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
        .isFloat({ min: 0 })
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
];


//### Create an Event for a Group specified by its id
router.post('/:groupId/events',requireAuth,checkGroup,validateEventBody,async(req,res,next) => {
    let newEventData = req.body
    const {groupId} = req.params
    console.log(groupId)

    //find the group
    const group= await Group.findByPk(groupId) // to check if the group exits

    //check if organizer
    const isOrganizer = group.organizer_id === req.user.id

    // check if co-host
    const membership = await Member.findOne({
        where: {
            user_id: req.user.id,   // User ID
            group_id: groupId  // Group ID
        }
    })
    if(!membership){
        return res.status(403).json({ error: 'Not Authorized. You are not a member of group ' })
    }

    //adding data to the events table
   if(isOrganizer || membership.status==='active'){

            //check if the venueId inserted has the group associated to it
            const insertedVenueId = newEventData.venueId
            const venueData = await Venue.findByPk(insertedVenueId)

            if(!venueData){
                return res.status(404).json({ error: 'Venue does not exist' })
            }

            if(venueData.group_id!==Number(groupId)){
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



                const {group_id,updatedAt,createdAt, ...output}=newEvent.toJSON()
                // If event creation is successful, respond with success message
                const response = {
                    ...output,
                    venueId: newEvent.venue_id,
                    groupId: parseInt(newEvent.group_id),
                    starDate: new Date(newEvent.start_date).toLocaleString(),
                    endDate: new Date(newEvent.end_date).toLocaleString(),
                };
                delete response.venue_id
                delete response.start_date
                delete response.end_date

                 //Add the current user as the host to the attendee table
                 const newHost = await Attendee.create({
                    user_id: req.user.id,
                    event_id: response.id,
                    status:"host"
                })


                return res.status(201).json(response)
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

router.get('/:groupId/venues',requireAuth,checkGroup, async(req,res,next) =>{
    try{
        const {groupId} = req.params

        const group= await Group.findByPk(groupId) // to check if the group exits

        //check if organizer
        const isOrganizer = group.organizer_id === req.user.id
        console.log(isOrganizer)


        // Check if the user has a membership
        const membership = await Member.findOne({
            where: {
                user_id: req.user.id,
                group_id: groupId
            }
        })
        if(!membership){
            return res.status(403).json({ error: 'Not Authorized. You are not a member of group ' })
        }



        if(isOrganizer || membership.status==="co-host"){
                const Venues = await Venue.findAll(
                    {
                        where:{group_id:groupId},
                        attributes:['id','group_id','address','city','state','lat','lng']
                    }
                )

                Venues.forEach(venue => {
                    venue.dataValues.groupId = venue.dataValues.group_id;
                    delete venue.dataValues.group_id;
                });

            return res.status(200).json({ Venues })
            }else{
                return res.status(403).json({ error: 'Not Authorized. Need to be the organizer or the co-host' })
            }



    }catch (error) {
        console.error('Error fetching venue data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
})



//### Create a new Venue for a Group specified by its id
//middleware function to check if body has the correct credentials and password. This is used in the route handler right after
const validateVenueCreation = [
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

router.post('/:groupId/venues',requireAuth,checkGroup,validateVenueCreation ,async(req,res) => {


        const {groupId} = req.params

        const group= await Group.findByPk(groupId) // to check if the group exits

        console.log(group)
        const  newVenueData = req.body

        //check if organizer
        const isOrganizer = group.organizer_id === req.user.id

        // Check if the user has a membership
        const membership = await Member.findOne({
            where: {
                user_id: req.user.id,
                group_id: groupId
            }
        })
        if(!membership){
            return res.status(403).json({ error: 'Not Authorized. You are not a member of group ' })
        }

        if(isOrganizer || membership.status==="co-host"){
            const newVenue = await Venue.create({group_id:groupId, address:newVenueData.address, city:newVenueData.city, state:newVenueData.state, lat:newVenueData.lat, lng: newVenueData.lng,name:newVenueData.name})

        if(!isProduction){
            newVenue.dataValues.groupId = newVenue.dataValues.group_id
            delete newVenue.dataValues.group_id
            const { createdAt, updatedAt, ...venueWithoutTimestamps } = newVenue.toJSON();

            return res.status(201).json(venueWithoutTimestamps)
        }else{
            console.log(newVenue)
            newVenue.dataValues.groupId = Number(groupId)
            delete newVenue.organizer_id
            delete newVenue.dataValues.group_id
            const { createdAt, updatedAt, ...venueWithoutTimestamps } = newVenue.toJSON();

            return res.status(201).json(venueWithoutTimestamps)
        }
        }else{
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer or the co-host' })
        }






})






//Groups Only Section
//Get all groups
router.get('/',async(req,res) => {

    const Groups = await Group.findAll({

        include: [{model:User},
            {
                model: GroupImage,
                attributes: ['preview_image','image_url']
            }
    ]

    })
        // Add numMembers field to each group object
        Groups.forEach(group => {
            group.dataValues.numMembers = group.dataValues.Users.length
            group.dataValues.organizerId = group.dataValues.organizer_id
             //finding image url
             let previewImage = null;
             if (group.GroupImages.length > 0) {
                 previewImage = group.GroupImages[0].image_url;
             }
             group.dataValues.previewImage=previewImage
            delete group.dataValues.Users
            delete group.dataValues.GroupImages
            delete group.dataValues.organizer_id
            group.dataValues.createdAt = new Date(group.dataValues.createdAt).toLocaleString();
            group.dataValues.updatedAt = new Date(group.dataValues.updatedAt).toLocaleString();
         });


    return res.json({Groups})
})




const validateGroupCreate = [
    check('name')
        .exists().withMessage('Group name is required')
        .notEmpty().withMessage('Group name cannot be empty')
        .isLength({ max: 60 }).withMessage('Group name cannot be more than 6 characters')
        .custom(async (value, { req }) => {
            // Perform a query to check if a group with the same name exists
            const existingGroup = await Group.findOne({
                where: {
                    name: value
                }
            });
            console.log(existingGroup)
            if (existingGroup) {
                throw new Error('Group name already exists');
            }
            return true;
        }),
    check('type')
        .exists().withMessage('Group type is required')
        .notEmpty().withMessage('Group type cannot be empty'),
    check('private')
        .exists().withMessage('Private status is required')
        .isBoolean().withMessage('Private status must be a boolean value')
        .notEmpty().withMessage('Private status cannot be empty'),
    check('city')
        .exists().withMessage("City must exist")
        .notEmpty().withMessage('City cannot be empty'),
    check('state')
        .exists().withMessage("State must exist")
        .notEmpty().withMessage('State cannot be empty'),
    handleValidationErrors
];

//Edit a group
router.put('/:groupId', requireAuth,checkGroup,validateGroupCreate,async(req,res,next) => {
    try {
        // Your code here
        let updates = req.body
        let {groupId} = req.params
        let {name,about,type,private,city,state} = updates

        const groupToUpdate = await Group.findOne({
            where:{
                id:groupId
            }
        })


          //check if organizer
        const isOrganizer = groupToUpdate.organizer_id === req.user.id



        if(isOrganizer){
            // Update only the fields that exist in the updates object
            for (const key in updates) {
                 {
                    groupToUpdate[key] = updates[key]
                }
            }

            await groupToUpdate.save()

            //date format change
            groupToUpdate.dataValues.organizerId = groupToUpdate.dataValues.organizer_id
            delete groupToUpdate.dataValues.organizer_id
            groupToUpdate.dataValues.createdAt = new Date(groupToUpdate.dataValues.createdAt).toLocaleString();
            groupToUpdate.dataValues.updatedAt = new Date(groupToUpdate.dataValues.updatedAt).toLocaleString();


            return res.status(200).json(

                groupToUpdate
            )
        }else{
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer of the group' })
        }





    } catch (error) {
        console.error('Error fetching group data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }

})


//Deletes a group
router.delete('/:groupId',requireAuth,checkGroup,async (req, res, next) => {
    try {
        // Your code here
        let updates = req.body
        let {groupId} = req.params


        const groupToDelete = await Group.findOne({
            where:{
                id:groupId
            }
        })
          //check if organizer
        const isOrganizer = groupToDelete.organizer_id === req.user.id



        if(isOrganizer){
                const deleteGroup = await Group.destroy({

                    where:{
                        id:groupId
                    }

                })
                 //date format change
            groupToDelete.dataValues.createdAt = new Date(groupToDelete.dataValues.createdAt).toLocaleString();
            groupToDelete.dataValues.updatedAt = new Date(groupToDelete.dataValues.updatedAt).toLocaleString();

            return res.json({
                    status: "200",
                    message: `Successfully deleted group`,

                })
        }else{
            return res.status(403).json({ error: 'Not Authorized. Need to be the organizer or the co-host' })
        }





    } catch (error) {
        console.error('Error fetching group data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }

})

//Create a new group
router.post('/',requireAuth, validateGroupCreate,async (req, res, next) => {
    console.log("hitting this")
    try {
        const loggedUserId = req.user.id
        const group = req.body
        const newGroup = await Group.create({organizer_id:loggedUserId, name:group.name, about:group.about, type:group.type, private:group.private, city:group.city, state: group.state})

        //adding the newly created user and group data to member table
        await Member.create({
            user_id: loggedUserId,
            group_id: newGroup.id,
            status: "Organizer"
        });

        //date formatting
        newGroup.dataValues.createdAt = new Date(newGroup.dataValues.createdAt).toLocaleString();
        newGroup.dataValues.updatedAt = new Date(newGroup.dataValues.updatedAt).toLocaleString();

        newGroup.dataValues.organizerId = loggedUserId
        delete newGroup.dataValues.organizer_id
        return res.status(201).json(newGroup);


    } catch(err) {
        next({
            status: 404,
            message: 'Could not create new group',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        })
    }
})


// Get all Groups joined or organized by the Current User
router.get('/current',requireAuth, async(req,res,next) =>{ //breaking because of the alias

    // try{
        const userId = req.user.id //from the middleware from session router

        const groupIds = await Member.findAll({
            where: {
                user_id: userId
            },
            attributes: ['group_id']
        });

        // Extract group IDs from the result
        const groupIdsArray = groupIds.map(member => member.group_id);

        // Fetch all groups where the specified user is present
        const groups = await Group.findAll({
            where: {
                id: {
                    [Op.in]: groupIdsArray
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: GroupImage
                },
                {
                    model: Venue
                }
            ]
        });


        // Transform the groups to the desired format
        const transformedGroups = groups.map(group => {
            // Extracting group information
            // console.log(group.toJSON())
            const { id, organizer_id: organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group.toJSON();

            // Extracting users and count
            const numMembers = group.Users.length;

            // Creating an array of user objects
            const users = group.Users.map(user => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
            })

            //finding image url
            let previewImage = null;
                if (group.GroupImages.length > 0) {
                    previewImage = group.GroupImages[0].image_url;
                }


            return {
                id,
                organizerId,
                name,
                about,
                type,
                private,
                city,
                state,
                createdAt,
                updatedAt,
                numMembers,
                previewImage

            };
        })



        // If no groups are found for the user, return an empty array
        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: "No groups found for the user" });
        }

        transformedGroups.forEach(group => {
            group.createdAt = new Date(group.createdAt).toLocaleString();
            group.updatedAt = new Date(group.updatedAt).toLocaleString();
            delete group.GroupImages
         });

        res.json({Groups:transformedGroups})


})

//Add an Image to a Group based on the Group's id

router.post('/:groupId/images', requireAuth, checkGroup, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.params;
        const newGroupImageData = req.body;
        console.log(groupId)


        // Find the group
        const group = await Group.findByPk(groupId);


        const organizerId = group.organizer_id;
        console.log(organizerId,userId)

        // If organizerId matches userId, then add the image
        if (organizerId === userId) {

            const newGroupImage = await GroupImage.create({
                preview_image: newGroupImageData.preview,
                image_url: newGroupImageData.url,
                group_id: groupId,
            })

            //formating
            output = newGroupImage.toJSON()
            output_object = {
                id:output.id,
                preview:output.preview_image,
                url:output.image_url
            }

            return res.status(201).json(output_object);
        } else {
            // Unauthorized access
            return res.status(403).json({
                status: 403,
                message: "Not Authorized"
            });
        }
    } catch (error) {
        console.error('Could not add an image:', error);
        res.status(500).json({ error: 'Could not add an image' });
    }
});


// Get details of a Group from a groupid

router.get('/:id',async(req,res,next) =>{
            const { id } = req.params;

            // Fetch the group with the given id
            const groupCheck = await Group.findByPk(id, {
                include: [
                    {
                        model: GroupImage,
                        attributes: ['id', 'image_url', 'preview_image'] // Attributes should be in quotes
                    },
                    {
                        model: Venue,
                        attributes:['id','group_id','address','city','state','lat','lng']
                    },
                    {
                        model:User
                    }
                ]
            });

            // If group is not found, return 404 error
            if (!groupCheck) {
                return res.status(404).json({ error:  "Group not found" });
            }



            // Extract organizer's id from the group
            const organizerId = groupCheck.organizer_id;

            // Fetch only the organizer's information
            const organizer = await User.findByPk(organizerId, {
                attributes: ['id', 'firstName', 'lastName']
            });

            // If organizer is not found, return 404 error
            if (!organizer) {
                return res.status(404).json({ error: "Organizer not found" });
            }

            // Convert the Sequelize object to JSON format
            const group = groupCheck.toJSON();

             // Add numMembers field to each group object
            group.numMembers = groupCheck.Users.length;
            delete group.Users;







            // Add the organizer's information to the group object
            group.Organizer = organizer;

            const response = {
                id: group.id,
                organizerId: organizer.id,
                name: group.name,
                about: group.about,
                type: group.type,
                private: group.private,
                city: group.city,
                state: group.state,
                createdAt: new Date(group.createdAt).toLocaleString(),
                updatedAt: new Date(group.updatedAt).toLocaleString(),
                numMembers: group.numMembers,
                GroupImages: group.GroupImages,
                Organizer: {
                    id: organizer.id,
                    firstName: organizer.firstName,
                    lastName: organizer.lastName
                },
                Venues: group.Venues
            };

            // Respond with the group object
            return res.status(200).json(response);



})





module.exports = router

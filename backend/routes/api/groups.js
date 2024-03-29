const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group,User,GroupImage,Venue } = require('../../db/models');
const group = require('../../db/models/group');
const { Model } = require('sequelize');

const router = express.Router()


// Venues Section
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

         res.status(200).json({ venues });
         return

        }else{
            next({
                status: 404, //  HTTP status code for 'Not Found'
                message: `Could not find group ${groupId}`,
                details: 'group not found'
            });
        }

    }catch (error) {
        console.error('Error fetching venue data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})





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
                    groupToUpdate[key] = updates[key];
                }
            }

            await groupToUpdate.save()

            return res.json({
                data: id,
                status: "success",
                message: `Successfully updated group`,
            });
        }

        else{

            next({
                status: "not-found",
                message: `Could not update group ${id}`,
                details: 'group not found'
            });

        }



    } catch (error) {
        console.error('Error fetching group data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

})


//Deletes a group
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedGroup = await Group.destroy({
            where: { id: req.params.id }
        });

        // Check if the group was found and deleted
        if (deletedGroup === 0) {
            // If not found, send a not-found error response
            return next({
                status: "not-found",
                message: `Could not remove Group ${req.params.id}`,
                details: "Group not found"
            });
        }

        return res.json({
            status: "success",
            message: `Successfully removed Group ${req.params.id}`,
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
});


//Add a new group
router.post('/', async (req, res, next) => {

    try {
        const group = req.body
        const newGroup = await Group.create({organizer_id:group.organizer_id, name:group.name, about:group.about, type:group.type, private:group.private, city:group.city, state: group.state})
        return res.json({
            status: "success",
            message: "Successfully created new group",
        });
    } catch(err) {
        next({
            status: "error",
            message: 'Could not create new group',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});


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
        res.status(200).json({ joinedGroups });


    }catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Internal Server Error' });
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
            });

            }else{
                next({
                    status: "new Image not added",
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
            });
        }else{
            next({
                status: "not-found",
                message: `Could not find group ${id}`,
                details: 'group not found'
            });

        }

    }catch (error) {
        console.error('Error fetching group data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

})



module.exports = router;

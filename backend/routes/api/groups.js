const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');

const router = express.Router()


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

            res.json({
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



    } catch(err) {
        next({
            status: "error",
            message: `Could not update group ${id}`,
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
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

        res.json({
            status: "success",
            message: `Successfully removed Group ${req.params.id}`,
        });
    } catch(err) {
        next({
            data: id,
            status: "error",
            message: `Could not remove Group ${req.params.id}`,
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});




module.exports = router;

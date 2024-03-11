const express = require('express');
const { Op, json } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req,res,next) => {

    const{credential, password} = req.body


    //find the user
    const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

    // check for username and password
    console.log(user)

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

    // if checks pass create an object for the safeuser

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

    // create the session cookie
    console.log(safeUser)

    await setTokenCookie(res,safeUser)

    return res.json({
        user:safeUser
    })


})

router.delete("/", async(req,res,next) => {
    res.clearCookie('token')
    return res.json({ message: "success"})


})




module.exports = router

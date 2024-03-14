const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


const router = express.Router()

//router to signup a new user
const validateSignup = [
    check('email')
    .isEmail()
    .exists({ checkFalsy: true})
    .withMessage("Please provide valid Email"),

    check('username')
    .exists({checkFalsy:true})
    .isLength({min:4})
    .withMessage('Please privide a username with at lead 4 charecters.'),
    check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors

]

router.post(
    '/',validateSignup,
    async (req, res) => {
      const { email, password, username,firstName,lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
       id: user.id,
        firstName:user.firstName,
        lastName:user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );


module.exports = router

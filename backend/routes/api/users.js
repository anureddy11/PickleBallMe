const express = require('express')
const bcrypt = require('bcryptjs');
const cors = require('cors');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { environment } = require('../../config');
const isProduction = environment === 'production';


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
    check('firstName')
    .exists({checkFalsy:true})
    .withMessage("First Name is required"),
   check('lastName')
    .exists({checkFalsy:true})
    .withMessage("Last Name is required"),


  handleValidationErrors

]

router.post(
    '/',validateSignup,

          async (req, res) => {
            try{
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
          }catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {

            //if not in production
            if(!isProduction){
                    const { fields } = error;
                    const errorMessage = {};
                    fields.forEach(field => {
                        errorMessage[field] = `User with that ${field} already exists`;
                    })
                    return res.status(500).json({
                      message: 'User already exists',
                      errors: errorMessage
            });


            }else{
                  const errorObject = error.errors
                  const errorMessage = {};
                errorObject.forEach(errorType =>{
                  errorMessage["message"] = errorType.message
                })
                  return res.status(500).json({
                    message: 'User already exists',
                    errors: errorMessage
                });
              }






          } else {
              // Handle other errors
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
      }
    })

  ;


module.exports = router

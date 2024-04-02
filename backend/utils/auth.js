// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res,user) => {

    const safeUser = {
        id: user.id,
        firstName:user.firstName,
        lastName:user.lastName,
        email: user.email,
        username: user.username,
    }

    const token = jwt.sign(
        {data: safeUser},
        secret,
        {expiresIn: parseInt(expiresIn)}
    )
    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };


  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

// //if group Exists
// const checkGroup = function(req,res,next) {
//   const {groupId} = req.params
//   // Check if the group exists

//   const group = await Group.findByPk(groupId);
//   if (group) return next();

//   const err = new Error('Group does not exist');
//     err.title = 'Group does not exist';
//     err.errors = { message: 'Group does not exist' };
//     err.status = 404;
//     return next(err);

// }


//   //if current user is Organizer or has a membership
//   const requireOrgMemAuth = function (req, _res, next) {
//    const loggedUserId = req.user.id
//    const {groupId} = req.params


//     const group = await Group.findByPk(groupId);

//     // Check if the user is the organizer
//     const isOrganizer = group.organizer_id === loggedUserId;

//      // Check if the user has a membership
//      const membership = await Member.findOne({
//             where: {
//                 user_id: userId,
//                 group_id: groupId
//             }
//         });

//     if(isOrganizer || membership.status==='active') return next();

//     const err = new Error('User not the Organizer or a Co-host');
//     err.title = 'Group does not exist';
//     err.errors = { message: 'Group does not exist' };
//     err.status = 401;
//     return next(err);

//   }




  module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth
};

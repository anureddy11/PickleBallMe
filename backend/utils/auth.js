// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User,Group,Event,Attendee,Member } = require('../db/models');

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

  //Authorization Middlewares
//check Group Middleware
const checkGroup = async function(req, res, next) {
  try {
      const { groupId } = req.params

      // Check if the group exists
      const group = await Group.findByPk(groupId)

      if (group) {
          return next()
      } else {
          const err = new Error('Group does not exist')
          err.title = 'Group does not exist'
          err.errors = { message: 'Group does not exist' }
          err.status = 404
          return next(err)
      }
  } catch (error) {
      // Handle any errors that occur during the database operation
      return next(error)
  }
}
//check Memeber Middleware
const checkMember = async function(req, res, next) {
  try {
      const loggedUserId = req.user.id;
      const { groupId } = req.params;
      let { memberId } = req.params || req.body;


      // Check if the user has an active membership
      const membership = await Member.findOne({
          where: {
              id:memberId
          }
      })

      if (membership) {
          return next()
      } else {
          const err = new Error('Membership does not exist')
          err.title = 'Membership does not exist'
          err.errors = { message: 'Membership does not exist' }
          err.status = 404
          return next(err)
      }
  } catch (error) {
      // Handle any errors that occur during the database operation
      return next(error)
  }
}

//check Event exists Middleware
const checkEvent = async function(req, res, next) {
      try {
        const { eventId } = req.params

        // Check if the group exists
        const event = await Event.findByPk(groupId)

        if (event) {
            return next()
        } else {
            const err = new Error('Event does not exist')
            err.title = 'Event does not exist'
            err.errors = { message: 'Event does not exist' }
            err.status = 404
            return next(err)
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        return next(error)
    }
}

  //Middleware if current user is Organizer or has a membership
  const requireOrgMemAuth = async function (req, _res, next) {
      try {
          const loggedUserId = req.user.id
          const { groupId } = req.params

          // Check if the user is the organizer
          const group = await Group.findByPk(groupId)
          const isOrganizer = group.organizer_id === loggedUserId

          // Check if the user has an active membership
          const membership = await Member.findOne({
              where: {
                  user_id: loggedUserId,
                  group_id: groupId
              }
          })

          // If the user is the organizer or has a co-host membership, proceed
          if (isOrganizer || (membership && membership.status === 'co-host')) {
              return next()
          } else {
              const err = new Error('User is not the Organizer or a Co-host')
              err.title = 'Unauthorized'
              err.status = 401
              return next(err)
          }
      } catch (error) {
          // Handle any errors that occur during the database operation
          return next(error)
      }
  }









  module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth,
    requireOrgMemAuth,
    checkGroup,
    checkMember,
    checkEvent
};

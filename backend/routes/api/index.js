// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./sessions.js')
const usersRouter = require('./users.js')


const {handleValidationErrors} = require('../../utils/validation.js')
const { setTokenCookie, restoreUser,requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

  // GET /api/set-token-cookie

// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//         username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
//     });

router.use(restoreUser);

router.use(handleValidationErrors);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;


// router.get(
//     '/restore-user',
//     (req, res) => {
//       return res.json(req.user);
//     }
//   );

//   // GET /api/require-auth
//   router.get(
//     '/require-auth',
//     requireAuth,
//     (req, res) => {
//       return res.json(req.user);
//     }
//   );





module.exports = router;

// backend/routes/api/index.js
const router = require('express').Router();

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

router.use(restoreUser) // will be applied for any request

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

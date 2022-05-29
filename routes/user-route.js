const express = require('express');
const router = express.Router();
const UserModel = require('../models/user-model');
const cors = require('cors');
const userModel = require('../models/user-model');
const { encryptPass, decryptPass } = require('../controllers/password');

router.use(cors());

// Find user - sends status ok if user exist and password match and error if not
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  try {
    if (!user) {
      res.status(400).json({ status: 'error' });
    } else {
      let userPass = decryptPass(user.password);
      if (user && userPass == password) {
        res.json({
          status: 'ok',
          _id: user._id,
          username: user.username,
          newsletter: user.newsletter,
        });
      } else {
        res.status(400).json({ status: 'error' });
      }
    }
  } catch (err) {
    res.json(err);
  }
});

// Look if username exists - sends status error otherwise ok
router.post('/signup', async (req, res) => {
  const { username } = req.body;
  const userConflict = await UserModel.findOne({ username });

  let safePass = encryptPass(req.body.password);
  req.body.password = safePass;
  if (userConflict) {
    res.status(409).json({ status: 'error' });
  } else {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  }
});

// Find user by id and send newsletter boolean
router.put('/change', async (req, res) => {
  const { _id, newsletter } = req.body;
  const user = await UserModel.findById({ _id });

  user.newsletter = newsletter;
  await user.save();
  res.status(200).json(user);
});

// Get info about user :id is found in frontend by localstorage
router.get('/:id', async (req, res) => {
  const user = await UserModel.findById({ _id: req.params.id });
  res.status(200).json(user);
});

module.exports = router;

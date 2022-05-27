const express = require('express');
const router = express.Router();
const UserModel = require('../models/user-model');
const CryptoJS = require('crypto-js');
const cors = require('cors');
const userModel = require('../models/user-model');

router.use(cors());

router.get('/', async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

const decryptPass = (encPass) => {
  let decPass = CryptoJS.AES.decrypt(encPass, 'Salt Key').toString(
    CryptoJS.enc.Utf8
  );
  return decPass;
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  try {
    if (!user) {
      res.status(400).json({ status: 'error' });
      // throw new Error('Invalid Username');
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
        // throw new Error('Invalid Password');
      }
    }
  } catch (err) {
    res.json(err);
  }
});
const encryptPass = (userPass) => {
  let encPass = CryptoJS.AES.encrypt(userPass, 'Salt Key').toString();
  return encPass;
};

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

router.put('/change', async (req, res) => {
  const { _id, newsletter } = req.body;
  const user = await UserModel.findById({ _id });

  user.newsletter = newsletter;
  await user.save();
  res.status(200).json(user);
});

// ta bort?
router.get('/:id', async (req, res) => {
  const user = await UserModel.findById({ _id: req.params.id });
  res.status(200).json(user);
});

// router.delete('/:id', async (req, res) => {
//   await UserModel.findByIdAndDelete({ _id: req.params.id });
//   res.status(200).json('Product successfully deleted');
// });

module.exports = router;

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user-model');

router.get('/', async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

router.post('/', async (req, res) => {
  const user = await UserModel.create(req.body);
  res.status(201).json(user);
});

router.put('/', async (req, res) => {
  const { _id, newsletter } = req.body;
  const user = await UserModel.findById({ _id });

  user.newsletter = newsletter;
  await user.save();
  res.status(200).json(user);
});

router.delete('/:id', async (req, res) => {
  await UserModel.findByIdAndDelete({ _id: req.params.id });
  res.status(200).json('Product successfully deleted');
});

module.exports = router;

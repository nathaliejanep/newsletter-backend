const express = require('express');
const router = express.Router();
const fs = require('fs');
const { authUser } = require('../auth');
const UserModel = require('../models/user-model');

router.get('/users', authUser, async (req, res) => {
  let users = await UserModel.find();

  let printSubscribers = '<div><h2>Subscribers</h2>';
  let printUsers = '<div><h2>Users</h2>';
  users.forEach((user) => {
    printUsers += `
    <ul>
      <li>${user.username} </li>
      <li>${user.newsletter}</li>
    </ul>
    </div>
    `;

    if (user.newsletter === true) {
      printSubscribers += `
        <ul>
          <li>${user.username} </li>
          <li>${user.newsletter}</li>
        </ul>
        </div>
        `;
    }
  });

  let printLists = printSubscribers;
  printLists += printUsers;

  res.status(200).send(printLists);
});

router.post('/login', (req, res) => {
  res.cookie('session_id', '123456');

  fs.readFile('admin.json', (err, data) => {
    const admins = JSON.parse(data);

    let foundAdmin = admins.find((admin) => {
      console.log(req.body.username);
      return (
        admin.username == req.body.username &&
        admin.password == req.body.password
      );
    });

    if (foundAdmin) {
      return res.send('loggedin');
    }

    res.send('fel');
  });
});

module.exports = router;
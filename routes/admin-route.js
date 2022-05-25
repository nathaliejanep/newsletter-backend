const express = require('express');
const router = express.Router();
const fs = require('fs');
const { authUser } = require('../auth');
const UserModel = require('../models/user-model');

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
      return res.redirect('/admin/users');
    }

    res.send('fel');
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('session_id');
  res.redirect('/');
});

router.get('/users', authUser, async (req, res) => {
  let users = await UserModel.find();

  let printSubscribers =
    '<a href="/admin/logout">Log out</a><h2>Subscribers</h2>';

  let printUsers = '<h2>All Users</h2>';
  users.forEach((user) => {
    printUsers += `
    <ul>
      <li>Email: ${user.username} </li>
      <li>Subscribes: ${user.newsletter ? 'Yes' : 'No'}</li>
    </ul>
    `;

    if (user.newsletter === true) {
      printSubscribers += `
        <ul>
          <li>${user.username} </li>
          <li>${user.newsletter}</li>
        </ul>
        `;
    }
  });

  let printLists = printSubscribers;
  printLists += printUsers;

  res.status(200).send(printLists);
});

module.exports = router;

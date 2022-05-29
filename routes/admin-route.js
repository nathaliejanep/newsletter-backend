const express = require('express');
const router = express.Router();
const fs = require('fs');
const { authUser } = require('../controllers/auth');
const UserModel = require('../models/user-model');

// Add cookie for auth in /user
router.post('/login', (req, res) => {
  res.cookie('session_id', '123456');

  fs.readFile('admin.json', (err, data) => {
    try {
      if (err) {
        console.log(`Something went wrong ${err}`);
        if (err.code == 'ENONENT') {
          console.log('File does not exist');
        }
        res.send('Something went wrong');
      }
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
      } else {
        let wrongHtml = 'Wrong credentials... <a href="/">Try Again</a>';
        res.send(wrongHtml);
      }
    } catch (err) {
      res.status(404);
    }
  });
});

// Clears cookie to remove authorization when logged out
router.get('/logout', (req, res) => {
  res.clearCookie('session_id');
  res.redirect('/');
});

// If authorized print Users Info
router.get('/users', authUser, async (req, res) => {
  let users = await UserModel.find();

  let printUsers = '<a href="/admin/logout">Log out</a><h2>Users</h2><ul>';
  for (const user of users) {
    printUsers += `<li> ${user.username} </li>`;
  }

  printUsers += '</ul>';
  printUsers += '<h2>Subscribers:</h2><ul>';
  for (const user of users) {
    if (user.newsletter === true) {
      printUsers += `
      <li> ${user.username} </li>
    `;
    }
    printUsers += '</ul>';
  }

  res.status(200).send(printUsers);
});

module.exports = router;

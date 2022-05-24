const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;

const UserRoute = require('./routes/user-route');
const AdminRoute = require('./routes/admin-route');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, './public/index.html'));
// });
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/users', UserRoute);
app.use('/admin', AdminRoute);

app.get('/set', (req, res) => {
  res.cookie('userId', 'wertvs3f');
  res.send('Kaka sparad');
});

app.get('/cookies', (req, res) => {
  console.log(req.cookies);
  res.send('Här är din kaka');
});
const URI =
  'mongodb+srv://nathaliejane:jP0XOuGrDLWZEgwP@cluster1.wf9is.mongodb.net/?retryWrites=true&w=majority';

async function connectDB() {
  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(URI, options);
    console.log('Connected to DB');
  } catch (err) {
    console.log(err);
  }
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

connectDB();

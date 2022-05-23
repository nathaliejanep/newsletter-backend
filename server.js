const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserRoute = require('./routes/user-route');
const PORT = 3000;

app.use(express.json());
app.use('/api/users', UserRoute);

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

function authUser(req, res, next) {
  const { cookies } = req;
  if ('session_id' in cookies) {
    console.log('session ID exists');

    if (cookies.session_id === '123456') next();
  } else {
    res.status(403).send({ msg: 'Not Authenticated' });
  }
  // if (req.user == null) {
  //   res.status(403);
  //   return res.send('You need to sign in');
  // }
}

module.exports = {
  authUser,
};

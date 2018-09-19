const User = require('../models/user');

exports.signup = function(req, res, next) {
  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  // Validation:
  if (!email || !password) {
    return res.status(442).send({ error: 'You must provide email and password '});
  }
  
  // Steps:
  // 1. See if a user with given email exists
  User.findOne({email: email}, function(err, exitingUser) {
    if (err) { return next(err); }

    // 2. If a user with email does exist, return an error
    if (exitingUser) {
      return res.status(422).send({error: 'Email is in use'});
    }

    // 3. If a user with email does NOT exit, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating the user was created
      res.json({ success: true });
    });
  })
/*
Sample:
  res.send({success: 'true'});
*/
}

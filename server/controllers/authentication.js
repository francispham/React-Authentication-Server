const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
                                  // iat (issue at time): to get report of issue
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
                    //sub (subject): to identify what this token belong to

}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user) });
}

// When User Sign Up:
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
      // res.json({ success: true });
      res.json({ token: tokenForUser(user) });
    });
  })
/*
Sample:
  res.send({success: 'true'});
*/
}

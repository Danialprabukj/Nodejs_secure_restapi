// 'use strict';

// var mongoose = require('mongoose'),
//   jwt = require('jsonwebtoken'),
//   bcrypt = require('bcrypt'),
//   User = mongoose.model('User');

// exports.register = function(req, res) {
//   var newUser = new User(req.body);
//   newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
//   newUser.save(function(err, user) {
//     if (err) {
//       return res.status(400).send({
//         message: err
//       });
//     } else {
//       user.hash_password = undefined;
//       return res.json(user);
//     }
//   });
// };

// exports.sign_in = function(req, res) {
//   User.findOne({
//     email: req.body.email
//   }, function(err, user) {
//     if (err) throw err;
//     if (!user || !user.comparePassword(req.body.password)) {
//       return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
//     }
//     return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
//   });
// };

// exports.loginRequired = function(req, res, next) {
//   if (req.user) {
//     next();
//   } else {

//     return res.status(401).json({ message: 'Unauthorized user!!' });
//   }
// };
// exports.profile = function(req, res, next) {
//   if (req.user) {
//     res.send(req.user);
//     next();
//   } 
//   else {
//    return res.status(401).json({ message: 'Invalid token' });
//   }
// };


'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');

exports.register = async function (req, res) {
  try {
    const newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    const user = await newUser.save();
    user.hash_password = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(400).send({
      message: err.message || 'An error occurred while registering the user.'
    });
  }
};

exports.sign_in = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
  } catch (err) {
    return res.status(500).send({
      message: err.message || 'An error occurred while signing in.'
    });
  }
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.profile = function (req, res) {
  if (req.user) {
    res.send(req.user);
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

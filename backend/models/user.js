const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User should have name'],
    trim: true,
    maxLength: [256, 'Name should be less than 256'],
  },
  email: {
    type: String,
    required: [true, 'User should have email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Email should be valid'],
    maxLength: [256, 'Email should be less than 256'],
  },
  password: {
    type: String,
    required: [true, 'User should have password'],
    trim: true,
    unique: true,
    minlength: [5, 'Password should be more than 6 charachters'],
    select: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWT = function() {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

userSchema.methods.getResetPasswordToken = function() {
  return jwt.sign({id: this._id}, process.env.REST_PASSWORD_JWT_SECRET, {
    expiresIn: process.env.REST_PASSWORD_EXPIRATION_TIME,
  });
};

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

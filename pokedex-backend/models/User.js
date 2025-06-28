const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Hasheado
  favorites: [
    {
      name: String,
      id: Number,
      sprite: String
    }
  ]
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'userSchema.json');
const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const DynamicUserSchema = new mongoose.Schema(schemaData, { strict: false });

const DynamicUsers = mongoose.model('users', DynamicUserSchema);

module.exports = DynamicUsers;


/*
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
}, { strict: false }); // Allows for dynamic fields to be added

const Users = mongoose.model('users', UserSchema);

module.exports = Users;
*/
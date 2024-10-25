const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// print schema path
const schemaPath = path.join(__dirname, 'config.json');

const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

let DynamicUserSchema = new mongoose.Schema(schemaData, { strict: false });
let DynamicUsers = mongoose.models.users || mongoose.model('users', DynamicUserSchema);


const getDynamicUsers = () => DynamicUserSchema;
const ReReadSchema = () => {
  DynamicUserSchema = new mongoose.Schema(JSON.parse(fs.readFileSync(schemaPath, 'utf8')), { strict: false });
  
  if (mongoose.models.users) {
    delete mongoose.models.users;
  }
  
  DynamicUsers = mongoose.model('users', DynamicUserSchema);
  return DynamicUserSchema;
};

module.exports = { DynamicUsers, getDynamicUsers, ReReadSchema };

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'config.json');
const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

let DynamicUserSchema = new mongoose.Schema(schemaData, { strict: false });

let DynamicUsers = mongoose.models.users || mongoose.model('users', DynamicUserSchema); // Check if model already exists

const getDynamicUsers = () => {
  return DynamicUserSchema;
};

const ReReadSchema = () => {
  // Reload schema
  DynamicUserSchema = new mongoose.Schema(JSON.parse(fs.readFileSync(schemaPath, 'utf8')), { strict: false });
  
  // Only create model if it doesn't already exist
  if (mongoose.models.users) {
    delete mongoose.models.users; // Remove the old model if it exists
  }
  
  DynamicUsers = mongoose.model('users', DynamicUserSchema);
  return DynamicUserSchema;
};

module.exports = {
  DynamicUsers,
  getDynamicUsers,
  ReReadSchema
};

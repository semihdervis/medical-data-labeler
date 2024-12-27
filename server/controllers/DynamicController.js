// controllers/userController.js

const UserModel = require('../models/UserModel')

const compareSchemas = (previousSchema, newSchema) => {
  const fieldsToAdd = {}
  const fieldsToRemove = {}

  // Add or update fields from new schema
  Object.keys(newSchema).forEach(field => {
    if (!previousSchema[field]) {
      // New field detected
      fieldsToAdd[field] = newSchema[field].defaultValue || null
    }
  })

  // Remove fields that are in the previous schema but not in the new one
  Object.keys(previousSchema).forEach(field => {
    if (!newSchema[field]) {
      // Field exists in previous schema but not in new schema
      fieldsToRemove[field] = 1
    }
  })

  return { fieldsToAdd, fieldsToRemove }
}

const updateSchemaFields = async () => {
  const currentSchema = UserModel.getDynamicUsers() // Get the current schema
  const newSchema = UserModel.ReReadSchema() // Correctly read new schema from the config.json
  const { fieldsToAdd, fieldsToRemove } = compareSchemas(
    currentSchema.obj,
    newSchema.obj
  ) // Compare schemas using 'obj'

  if (Object.keys(fieldsToAdd).length > 0) {
    await UserModel.DynamicUsers.updateMany({}, { $set: fieldsToAdd }) // Add new fields
  }
  if (Object.keys(fieldsToRemove).length > 0) {
    await UserModel.DynamicUsers.updateMany({}, { $unset: fieldsToRemove }) // Remove old fields
  }
}

exports.refreshFields = async (req, res) => {
  try {
    await updateSchemaFields()
    console.log('Documents updated successfully!')
    res.send('Fields updated successfully')
  } catch (error) {
    console.error('Error updating fields:', error)
    res.status(500).send('Error updating fields')
  }
}

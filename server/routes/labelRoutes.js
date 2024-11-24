const express = require('express')
const router = express.Router()
const labelController = require('../controllers/labelController')
const authenticate = require('../middlewares/authenticate')
const checkAdmin = require('../middlewares/checkAdmin')

// Label Schema Routes
router.post(
  '/schema',
  authenticate,
  checkAdmin,
  labelController.createLabelSchema
)
router.get(
  '/schema',
  authenticate,
  checkAdmin,
  labelController.getAllLabelSchemas
)
router.get(
  '/schema/:id',
  authenticate,
  checkAdmin,
  labelController.getLabelSchemaById
)
router.put(
  '/schema/:id',
  authenticate,
  checkAdmin,
  labelController.updateLabelSchema
)
router.delete(
  '/schema/:id',
  authenticate,
  checkAdmin,
  labelController.deleteLabelSchema
)

// Label Answer Routes
router.post('/answer', authenticate, labelController.createLabelAnswer)
router.get('/answer', authenticate, labelController.getAllLabelAnswers)
router.get('/answer/:id', authenticate, labelController.getLabelAnswerById)
router.put('/answer/:id', authenticate, labelController.updateLabelAnswer)
router.delete('/answer/:id', authenticate, labelController.deleteLabelAnswer)

module.exports = router

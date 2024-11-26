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

router.get('/schema/project/:id/', authenticate, labelController.getLabelSchemaByProjectId)
/*
{
  "projectId": "6729224313e018e76715f7e0",
  "type": "image",
  "labelData": [
    {
      "labelQuestion": "Is infection visible?",
      "labelType": "dropdown",
      "labelOptions": ["Yes", "No"]
    },
    {
      "labelQuestion": "Severity of infection",
      "labelType": "int"
    }
  ]
} */



// Label Answer Routes
router.post('/answer', authenticate, labelController.createLabelAnswer)


/*

{
  "schemaId": "schema_id_here",
  "answers": [
    {
      "field": "Is infection visible?",
      "value": "Yes"
    },
    {
      "field": "Severity of infection",
      "value": "3"
    }
  ]
}

*/


router.get('/answer', authenticate, labelController.getAllLabelAnswers)
router.get('/answer/:id', authenticate, labelController.getLabelAnswerById)
router.put('/answer/:id', authenticate, labelController.updateLabelAnswer)
router.delete('/answer/:id', authenticate, labelController.deleteLabelAnswer)

module.exports = router

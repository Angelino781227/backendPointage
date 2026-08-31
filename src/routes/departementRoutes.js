const express = require('express');
const router = express.Router();
const {
  createDepartement,
  showAllDepartement,
  updateDepartement,
  deleteDepartement,
  showDepartementById,
} = require('../controllers/departementController');

router.route('/').post(createDepartement).get(showAllDepartement);

router
  .route('/:id')
  .get(showDepartementById)
  .put(updateDepartement)
  .delete(deleteDepartement);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  creerEmploye,
  getEmployes,
  getEmployeParId,
  modifierEmploye,
  supprimerEmploye,
} = require('../controllers/employeController');

router.route('/').post(creerEmploye).get(getEmployes);

router
  .route('/:id')
  .get(getEmployeParId)
  .put(modifierEmploye)
  .delete(supprimerEmploye);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  creerPointage,
  getPointages,
  getPointageParId,
  modifierPointage,
  supprimerPointage,
} = require('../controllers/pointageController');

router.route('/').post(creerPointage).get(getPointages);

router
  .route('/:id')
  .get(getPointageParId)
  .put(modifierPointage)
  .delete(supprimerPointage);

module.exports = router;

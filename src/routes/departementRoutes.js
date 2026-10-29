const express = require('express');
const router = express.Router();
const {
  creerDepartement,
  getDepartements,
  getDepartementParId,
  modifierDepartement,
  modifierChefDepartement,
  supprimerDepartement
} = require('../controllers/departementController');

router.route('/').post(creerDepartement).get(getDepartements);

router
  .route('/:id')
  .get(getDepartementParId)
  .put(modifierDepartement)
  .delete(supprimerDepartement);

router.patch('/:id/chef', modifierChefDepartement);
  

module.exports = router;

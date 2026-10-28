const express = require('express');
const router = express.Router();
const {
  creerDepartement,
  getDepartements,
  getDepartementParId,
  modifierDepartement,
  supprimerDepartement,
  definirChefDepartement,
  trouverCandidatsChefs
} = require('../controllers/departementController');

router.route('/').post(creerDepartement).get(getDepartements);

router
  .route('/:id')
  .get(getDepartementParId)
  .put(modifierDepartement)
  .delete(supprimerDepartement);

router.get('/candidat-chefs', trouverCandidatsChefs);
router.patch('/:id/chef', definirChefDepartement);
  

module.exports = router;

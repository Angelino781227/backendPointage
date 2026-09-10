const express = require('express');
const router = express.Router();
const {
  createUser,
  showAllUser,
  showUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/').post(createUser).get(showAllUser);

router
  .route('/:id')
  .get(showUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

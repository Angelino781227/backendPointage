const User = require('../models/User');

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    // defaultScope exclut déjà userPassword, mais on s'assure de ne rien exposer
    const userSansMotDePasse = user.toJSON();
    delete userSansMotDePasse.userPassword;
    res.status(201).json(userSansMotDePasse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Utilisateur existant (login déjà utilisé)'));
    }
    res.status(400);
    next(error);
  }
};

const showAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const showUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    await user.destroy();
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  showAllUser,
  showUserById,
  updateUser,
  deleteUser,
};

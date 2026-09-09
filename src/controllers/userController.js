const User = require('../models/User');

// @desc    Créer un utilisateur
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // On retire le mot de passe haché de la réponse, même s'il ne devrait pas y être
    const userSansMotDePasse = user.toObject();
    delete userSansMotDePasse.userPassword;

    res.status(201).json(userSansMotDePasse);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Utilisateur existant (login déjà utilisé)'));
    }
    res.status(400);
    next(error);
  }
};

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
const showAllUser = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un utilisateur par ID
// @route   GET /api/users/:id
const showUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
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
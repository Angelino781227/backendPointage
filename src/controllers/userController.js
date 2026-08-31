const User = require('../models/User');
const User = require('../models/User');

const createUser = async(res, req, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            return next(new Error('User existant'));
        }
        res.status(400);
        next(error);
    }
};

const showAllUser = async(res, req, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
      } catch (error) {
        next(error);
      }
};

const showUserById = async(res, req, next) => {
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

const updateUser = async(res, req, next) => {
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

const deleteUser = async(res, req, next) => {
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
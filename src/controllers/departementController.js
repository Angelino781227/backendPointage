const Departement = require('../models/Departement');
const Departement = require('../models/Departement');

const createDepartement = async(res, req, next) => {
    try {
        const departement = await Departement.create(req.body);
        res.status(201).json(departement);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            return next(new Error('Departement existant'));
        }
        res.status(400);
        next(error);
    }
};

const showAllDepartement = async(res, req, next) => {
    try {
        const departements = await Departement.find().sort({ createdAt: -1 });
        res.json(departements);
      } catch (error) {
        next(error);
      }
};

const showDepartementById = async(res, req, next) => {
    try {
        const departement = await Departement.findById(req.params.id);
        if (!departement) {
          res.status(404);
          return next(new Error('Departement non trouvé'));
        }
        res.json(departement);
      } catch (error) {
        next(error);
      }
};

const updateDepartement = async(res, req, next) => {
    try {
        const departement = await Departement.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!departement) {
          res.status(404);
          return next(new Error('Departement non trouvé'));
        }
        res.json(departement);
      } catch (error) {
        next(error);
      }
};

const deleteDepartement = async(res, req, next) => {
    try {
        const departement = await Departement.findByIdAndDelete(req.params.id);
        if (!departement) {
          res.status(404);
          return next(new Error('Employé non trouvé'));
        }
        res.json({ message: 'Employé supprimé avec succès' });
      } catch (error) {
        next(error);
      }
};

module.exports = {
    createDepartement,
    showAllDepartement,
    showDepartementById,
    updateDepartement,
    deleteDepartement,
};
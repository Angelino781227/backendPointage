const Employe = require('../models/Employe');

const creerEmploye = async (req, res, next) => {
  try {
    const employe = await Employe.create(req.body);
    res.status(201).json(employe);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Matricule ou CIN déjà existant'));
    }
    res.status(400);
    next(error);
  }
};

const getEmployes = async (req, res, next) => {
  try {
    const employes = await Employe.find().sort({ createdAt: -1 });
    res.json(employes);
  } catch (error) {
    next(error);
  }
};

const getEmployeParId = async (req, res, next) => {
  try {
    const employe = await Employe.findById(req.params.id);
    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }
    res.json(employe);
  } catch (error) {
    next(error);
  }
};

const modifierEmploye = async (req, res, next) => {
  try {
    const employe = await Employe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }
    res.json(employe);
  } catch (error) {
    next(error);
  }
};

const supprimerEmploye = async (req, res, next) => {
  try {
    const employe = await Employe.findByIdAndDelete(req.params.id);
    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }
    res.json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerEmploye,
  getEmployes,
  getEmployeParId,
  modifierEmploye,
  supprimerEmploye,
};

const { Employe } = require('../models');

const creerEmploye = async (req, res, next) => {
  try {
    const employe = await Employe.create(req.body);
    res.status(201).json(employe);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Matricule ou CIN déjà existant'));
    }
    res.status(400);
    next(error);
  }
};

const getEmployes = async (req, res, next) => {
  try {
    const employes = await Employe.findAll({ order: [['createdAt', 'DESC']] });
    res.json(employes);
  } catch (error) {
    next(error);
  }
};

const getEmployeParId = async (req, res, next) => {
  try {
    const employe = await Employe.findByPk(req.params.id);
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
    const employe = await Employe.findByPk(req.params.id);
    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }
    await employe.update(req.body);
    res.json(employe);
  } catch (error) {
    next(error);
  }
};

const supprimerEmploye = async (req, res, next) => {
  try {
    const employe = await Employe.findByPk(req.params.id);
    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }
    await employe.destroy();
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

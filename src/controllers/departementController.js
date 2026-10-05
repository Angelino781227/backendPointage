const Departement = require('../../models/Departement');

const creerDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.create(req.body);
    res.status(201).json(departement);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Un département avec ce nom existe déjà'));
    }
    res.status(400);
    next(error);
  }
};

const getDepartements = async (req, res, next) => {
  try {
    const departements = await Departement.findAll({ order: [['createdAt', 'DESC']] });
    res.json(departements);
  } catch (error) {
    next(error);
  }
};

const getDepartementParId = async (req, res, next) => {
  try {
    const departement = await Departement.findByPk(req.params.id);
    if (!departement) {
      res.status(404);
      return next(new Error('Département non trouvé'));
    }
    res.json(departement);
  } catch (error) {
    next(error);
  }
};

const modifierDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.findByPk(req.params.id);
    if (!departement) {
      res.status(404);
      return next(new Error('Département non trouvé'));
    }
    await departement.update(req.body);
    res.json(departement);
  } catch (error) {
    next(error);
  }
};

const supprimerDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.findByPk(req.params.id);
    if (!departement) {
      res.status(404);
      return next(new Error('Département non trouvé'));
    }
    await departement.destroy();
    res.json({ message: 'Département supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerDepartement,
  getDepartements,
  getDepartementParId,
  modifierDepartement,
  supprimerDepartement,
};

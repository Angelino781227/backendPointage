const Pointage = require('../models/Pointage');
const Employe = require('../models/Employe');

const creerPointage = async (req, res, next) => {
  try {
    const pointage = await Pointage.create(req.body);
    res.status(201).json(pointage);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Un pointage existe déjà pour cet employé à cette date'));
    }
    res.status(400);
    next(error);
  }
};

const getPointages = async (req, res, next) => {
  try {
    const filtre = {};
    if (req.query.employe) filtre.employeId = req.query.employe;
    if (req.query.date) filtre.date = req.query.date; // format attendu : YYYY-MM-DD

    const pointages = await Pointage.findAll({
      where: filtre,
      include: [{ model: Employe, attributes: ['matricule', 'nom', 'prenoms', 'departement'] }],
      order: [['date', 'DESC']],
    });
    res.json(pointages);
  } catch (error) {
    next(error);
  }
};

const getPointageParId = async (req, res, next) => {
  try {
    const pointage = await Pointage.findByPk(req.params.id, {
      include: [{ model: Employe, attributes: ['matricule', 'nom', 'prenoms', 'departement'] }],
    });
    if (!pointage) {
      res.status(404);
      return next(new Error('Pointage non trouvé'));
    }
    res.json(pointage);
  } catch (error) {
    next(error);
  }
};

const modifierPointage = async (req, res, next) => {
  try {
    const pointage = await Pointage.findByPk(req.params.id);
    if (!pointage) {
      res.status(404);
      return next(new Error('Pointage non trouvé'));
    }
    await pointage.update(req.body);
    res.json(pointage);
  } catch (error) {
    next(error);
  }
};

const supprimerPointage = async (req, res, next) => {
  try {
    const pointage = await Pointage.findByPk(req.params.id);
    if (!pointage) {
      res.status(404);
      return next(new Error('Pointage non trouvé'));
    }
    await pointage.destroy();
    res.json({ message: 'Pointage supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerPointage,
  getPointages,
  getPointageParId,
  modifierPointage,
  supprimerPointage,
};

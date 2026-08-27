const Pointage = require('../models/Pointage');

const creerPointage = async (req, res, next) => {
  try {
    const pointage = await Pointage.create(req.body);
    res.status(201).json(pointage);
  } catch (error) {
    if (error.code === 11000) {
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
    if (req.query.employe) filtre.employe = req.query.employe;
    if (req.query.date) {
      const debut = new Date(req.query.date);
      const fin = new Date(req.query.date);
      fin.setDate(fin.getDate() + 1);
      filtre.date = { $gte: debut, $lt: fin };
    }

    const pointages = await Pointage.find(filtre)
      .populate('employe', 'matricule nom prenoms departement')
      .sort({ date: -1 });
    res.json(pointages);
  } catch (error) {
    next(error);
  }
};

const getPointageParId = async (req, res, next) => {
  try {
    const pointage = await Pointage.findById(req.params.id).populate(
      'employe',
      'matricule nom prenoms departement'
    );
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
    const pointage = await Pointage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
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

const supprimerPointage = async (req, res, next) => {
  try {
    const pointage = await Pointage.findByIdAndDelete(req.params.id);
    if (!pointage) {
      res.status(404);
      return next(new Error('Pointage non trouvé'));
    }
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

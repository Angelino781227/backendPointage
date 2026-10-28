const { Departement, Employe } = require('../models');

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

async function recalculerNombreEmployes() {
  const departements = await Departement.findAll();

  for (const departement of departements) {
    const nombre = await Employe.count({
      where: {
        departement: departement.nom,
      },
    });

    await departement.update({
      nombreEmploye: nombre,
    });
  }
}

// Détecter les candidats potentiels au poste de chef
async function trouverCandidatsChefs() {
  const employes = await Employe.findAll({
    attributes: [
      'employeId',
      'matricule',
      'nom',
      'prenoms',
      'departement',
      'fonction',
    ],
  });

  const regexChef = /\b(chef|responsable|charge)\b/i;

  return employes
    .filter(employe => {
      const fonctionNormalisee = (employe.fonction || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return regexChef.test(fonctionNormalisee);
    })
    .map(employe => ({
      employeId: employe.employeId,
      matricule: employe.matricule,
      nom: employe.nom,
      prenoms: employe.prenoms,
      departement: employe.departement,
      fonction: employe.fonction,
    }));
}

module.exports = {
  creerDepartement,
  getDepartements,
  getDepartementParId,
  modifierDepartement,
  supprimerDepartement,
  recalculerNombreEmployes,
  trouverCandidatsChefs
};

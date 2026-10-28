
const { Departement, Employe } = require('../models');

// Recalculer le nombre d'employés de chaque département
const recalculerNombreEmployes = async () => {
  const departements = await Departement.findAll();

  for (const departement of departements) {
    const nombre = await Employe.count({
      where: {
        departement: departement.nomDepartement,
      },
    });

    await departement.update({
      nombreEmploye: nombre,
    });
  }
};

// Détecter les candidats potentiels au poste de chef
const trouverCandidatsChefs = async (req, res, next) => {
  try {
    const employes = await Employe.findAll({
      attributes: [
        'employeId',
        'matricule',
        'nom',
        'prenoms',
        'departement',
        'fonction',
      ],
      order: [['nom', 'ASC']],
    });

    const regexChef = /\b(chef|responsable|charge)\b/i;

    const candidats = employes
      .filter((employe) => {
        const fonctionNormalisee = (employe.fonction || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return regexChef.test(fonctionNormalisee);
      })
      .map((employe) => ({
        employeId: employe.employeId,
        matricule: employe.matricule,
        nom: employe.nom,
        prenoms: employe.prenoms,
        departement: employe.departement,
        fonction: employe.fonction,
      }));

    res.json(candidats);
  } catch (error) {
    next(error);
  }
};

// Définir le chef d'un département à partir d'un employé existant
const definirChefDepartement = async (req, res, next) => {
  try {
    const { employeId } = req.body;

    if (!employeId) {
      res.status(400);
      return next(new Error("L'identifiant de l'employé est obligatoire"));
    }

    const departement = await Departement.findByPk(req.params.id);

    if (!departement) {
      res.status(404);
      return next(new Error('Département non trouvé'));
    }

    const employe = await Employe.findByPk(employeId);

    if (!employe) {
      res.status(404);
      return next(new Error('Employé non trouvé'));
    }

    // L'employé doit appartenir au département sélectionné.
    if (employe.departement !== departement.nomDepartement) {
      res.status(400);
      return next(
        new Error("Cet employé n'appartient pas à ce département")
      );
    }

    // Le poste doit contenir chef, responsable ou chargé.
    const fonctionNormalisee = (employe.fonction || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (!/\b(chef|responsable|charge)\b/i.test(fonctionNormalisee)) {
      res.status(400);
      return next(
        new Error(
          "La fonction de cet employé ne correspond pas aux critères de détection d'un chef"
        )
      );
    }

    const nomComplet = `${employe.prenoms} ${employe.nom}`;

    await departement.update({
      chefDepartement: nomComplet,
    });

    res.json({
      message: 'Chef de département mis à jour avec succès',
      departement,
    });
  } catch (error) {
    next(error);
  }
};

const creerDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.create(req.body);
    res.status(201).json(departement);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Un département avec ce nom existe déjà'));
    }
    next(error);
  }
};

const getDepartements = async (req, res, next) => {
  try {
    const departements = await Departement.findAll({
      order: [['createdAt', 'DESC']],
    });

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

    // L'effectif est calculé automatiquement : ne pas le modifier
    // directement depuis le corps de la requête.
    const { nombreEmploye, ...donnees } = req.body;

    await departement.update(donnees);

    res.json(departement);
  } catch (error) {
    next(error);
  }
};

const supprimerDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.findByPk(req.params.id);

    const nombreEmployes = await Employe.count({
      where: {
        departementId: departement.departementId,
      },
    });
    
    if (nombreEmployes > 0) {
      res.status(409);
      return next(
        new Error(
          'Impossible de supprimer ce département : des employés y sont encore affectés.'
        )
      );
    }

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
  recalculerNombreEmployes,
  trouverCandidatsChefs,
  definirChefDepartement,
};

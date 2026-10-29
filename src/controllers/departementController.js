
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

const creerDepartement = async (req, res, next) => {
  try {
    const { nomDepartement, nomEmploye, matricule } = req.body;

    if (
      typeof nomDepartement !== 'string' ||
      !nomDepartement.trim() ||
      typeof nomEmploye !== 'string' ||
      !nomEmploye.trim() ||
      typeof matricule !== 'string' ||
      !matricule.trim()
    ) {
      return res.status(400).json({
        message: 'Le département, le nom de l’employé et son matricule sont obligatoires.',
      });
    }

    const resultat = await sequelize.transaction(async (transaction) => {
      const departement = await Departement.create(
        {
          nomDepartement: nomDepartement.trim(),
          nombreEmploye: 0,
          chefDepartementId: null,
        },
        { transaction }
      );

      const employe = await Employe.create(
        {
          nom: nomEmploye.trim(),
          matricule: matricule.trim(),
          departementId: departement.departementId,
          cin: null,
          prenoms: null,
          fonction: null,
        },
        { transaction }
      );

      await departement.update(
        {
          chefDepartementId: employe.employeId,
          nombreEmploye: 1,
        },
        { transaction }
      );

      return { departement, employe };
    });

    return res.status(201).json({
      message: 'Département et chef provisoire créés avec succès.',
      ...resultat,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Ce nom de département ou ce matricule existe déjà.',
      });
    }

    return next(error);
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

const modifierChefDepartement = async (req, res, next) => {
  try {
    const { employeId } = req.body;

    const resultat = await sequelize.transaction(async (transaction) => {
      const departement = await Departement.findByPk(req.params.id, {
        transaction,
      });

      if (!departement) {
        const error = new Error('Département non trouvé.');
        error.status = 404;
        throw error;
      }

      const employe = await Employe.findByPk(employeId, {
        transaction,
      });

      if (!employe) {
        const error = new Error('Employé non trouvé.');
        error.status = 404;
        throw error;
      }

      if (employe.departementId !== departement.departementId) {
        const error = new Error(
          'Le chef doit appartenir au département concerné.'
        );
        error.status = 400;
        throw error;
      }

      await departement.update(
        { chefDepartementId: employe.employeId },
        { transaction }
      );

      return departement;
    });

    return res.json({
      message: 'Chef de département modifié avec succès.',
      departement: resultat,
    });
  } catch (error) {
    return next(error);
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
  modifierChefDepartement,
  supprimerDepartement,
  recalculerNombreEmployes
};

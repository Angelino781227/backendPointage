#!/bin/bash
# Script de structuration du projet pointage-backend (version MySQL/Sequelize)
# A executer depuis la racine du projet (a cote de package.json)
# Utilisation : bash setup-projet-mysql.sh

echo "Creation des dossiers..."
mkdir -p src/config src/models src/controllers src/routes src/middlewares

echo "Creation de src/config/db.js..."
cat > src/config/db.js << 'FILE_EOF'
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL connecté : ${process.env.DB_HOST}/${process.env.DB_NAME}`);
  } catch (error) {
    console.error(`Erreur de connexion MySQL : ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
FILE_EOF

echo "Creation de src/models/Departement.js..."
cat > src/models/Departement.js << 'FILE_EOF'
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Departement = sequelize.define(
  'Departement',
  {
    nomDepartement: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Le nom du département est obligatoire' } },
    },
    chefDepartement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Le chef de département est obligatoire' } },
    },
    nombreEmploye: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'departements',
    timestamps: true,
  }
);

module.exports = Departement;
FILE_EOF

echo "Creation de src/models/Employe.js..."
cat > src/models/Employe.js << 'FILE_EOF'
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employe = sequelize.define(
  'Employe',
  {
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Le matricule est obligatoire' } },
    },
    cin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Le CIN est obligatoire' } },
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Le nom est obligatoire' } },
    },
    prenoms: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Les prénoms sont obligatoires' } },
    },
    departement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Le département est obligatoire' } },
    },
    fonction: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'La fonction est obligatoire' } },
    },
    telephone: {
      type: DataTypes.STRING,
    },
    adresse: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'employes',
    timestamps: true,
  }
);

module.exports = Employe;
FILE_EOF

echo "Creation de src/models/Pointage.js..."
cat > src/models/Pointage.js << 'FILE_EOF'
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Employe = require('./Employe');

const Pointage = sequelize.define(
  'Pointage',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        estJourOuvre(valeur) {
          const jour = new Date(valeur).getDay(); // 0 = dimanche, 6 = samedi
          if (jour === 0 || jour === 6) {
            throw new Error(
              'Le pointage ne peut concerner que les jours ouvrés (lundi à vendredi)'
            );
          }
        },
      },
    },
    arriveeMatin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    departMatin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    arriveeApresMidi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    departApresMidi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'pointages',
    timestamps: true,
    indexes: [
      // Un seul pointage par employé et par jour
      { unique: true, fields: ['employeId', 'date'] },
    ],
  }
);

// Relation : un employé a plusieurs pointages
Employe.hasMany(Pointage, { foreignKey: 'employeId', onDelete: 'CASCADE' });
Pointage.belongsTo(Employe, { foreignKey: 'employeId' });

module.exports = Pointage;
FILE_EOF

echo "Creation de src/models/User.js..."
cat > src/models/User.js << 'FILE_EOF'
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const Departement = require('./Departement');

const User = sequelize.define(
  'User',
  {
    userBranch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Departement,
        key: 'id',
      },
    },
    userRole: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // false = utilisateur standard, true = administrateur
    },
    userLogin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: { args: [3, 255], msg: "L'identifiant doit contenir au moins 3 caractères" },
      },
      set(valeur) {
        this.setDataValue('userLogin', valeur.trim().toLowerCase());
      },
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8, 255], msg: 'Le mot de passe doit contenir au moins 8 caractères' },
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['userPassword'] }, // masqué par défaut, comme select:false en Mongoose
    },
    scopes: {
      avecMotDePasse: { attributes: {} }, // à utiliser explicitement pour le login
    },
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('userPassword')) {
          const salt = await bcrypt.genSalt(10);
          user.userPassword = await bcrypt.hash(user.userPassword, salt);
        }
      },
    },
  }
);

// Méthode d'instance pour comparer un mot de passe en clair au hash stocké
User.prototype.comparerMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.userPassword);
};

// Relation : un département a plusieurs utilisateurs
Departement.hasMany(User, { foreignKey: 'userBranch' });
User.belongsTo(Departement, { foreignKey: 'userBranch' });

module.exports = User;
FILE_EOF

echo "Creation de src/controllers/departementController.js..."
cat > src/controllers/departementController.js << 'FILE_EOF'
const Departement = require('../models/Departement');

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
FILE_EOF

echo "Creation de src/controllers/employeController.js..."
cat > src/controllers/employeController.js << 'FILE_EOF'
const Employe = require('../models/Employe');

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
FILE_EOF

echo "Creation de src/controllers/pointageController.js..."
cat > src/controllers/pointageController.js << 'FILE_EOF'
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
FILE_EOF

echo "Creation de src/controllers/userController.js..."
cat > src/controllers/userController.js << 'FILE_EOF'
const User = require('../models/User');

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    // defaultScope exclut déjà userPassword, mais on s'assure de ne rien exposer
    const userSansMotDePasse = user.toJSON();
    delete userSansMotDePasse.userPassword;
    res.status(201).json(userSansMotDePasse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return next(new Error('Utilisateur existant (login déjà utilisé)'));
    }
    res.status(400);
    next(error);
  }
};

const showAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const showUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error('Utilisateur non trouvé'));
    }
    await user.destroy();
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
FILE_EOF

echo "Creation de src/routes/departementRoutes.js..."
cat > src/routes/departementRoutes.js << 'FILE_EOF'
const express = require('express');
const router = express.Router();
const {
  creerDepartement,
  getDepartements,
  getDepartementParId,
  modifierDepartement,
  supprimerDepartement,
} = require('../controllers/departementController');

router.route('/').post(creerDepartement).get(getDepartements);

router
  .route('/:id')
  .get(getDepartementParId)
  .put(modifierDepartement)
  .delete(supprimerDepartement);

module.exports = router;
FILE_EOF

echo "Creation de src/routes/employeRoutes.js..."
cat > src/routes/employeRoutes.js << 'FILE_EOF'
const express = require('express');
const router = express.Router();
const {
  creerEmploye,
  getEmployes,
  getEmployeParId,
  modifierEmploye,
  supprimerEmploye,
} = require('../controllers/employeController');

router.route('/').post(creerEmploye).get(getEmployes);

router
  .route('/:id')
  .get(getEmployeParId)
  .put(modifierEmploye)
  .delete(supprimerEmploye);

module.exports = router;
FILE_EOF

echo "Creation de src/routes/pointageRoutes.js..."
cat > src/routes/pointageRoutes.js << 'FILE_EOF'
const express = require('express');
const router = express.Router();
const {
  creerPointage,
  getPointages,
  getPointageParId,
  modifierPointage,
  supprimerPointage,
} = require('../controllers/pointageController');

router.route('/').post(creerPointage).get(getPointages);

router
  .route('/:id')
  .get(getPointageParId)
  .put(modifierPointage)
  .delete(supprimerPointage);

module.exports = router;
FILE_EOF

echo "Creation de src/routes/userRoutes.js..."
cat > src/routes/userRoutes.js << 'FILE_EOF'
const express = require('express');
const router = express.Router();
const {
  createUser,
  showAllUser,
  showUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/').post(createUser).get(showAllUser);

router
  .route('/:id')
  .get(showUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
FILE_EOF

echo "Creation de src/routes/testRoutes.js..."
cat > src/routes/testRoutes.js << 'FILE_EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API de gestion de pointage opérationnelle 🚀' });
});

module.exports = router;
FILE_EOF

echo "Creation de src/middlewares/errorHandler.js..."
cat > src/middlewares/errorHandler.js << 'FILE_EOF'
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
FILE_EOF

echo "Creation de src/app.js..."
cat > src/app.js << 'FILE_EOF'
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const testRoutes = require('./routes/testRoutes');
const employeRoutes = require('./routes/employeRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const userRoutes = require('./routes/userRoutes');
const departementRoutes = require('./routes/departementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departements', departementRoutes);

app.use(errorHandler);

module.exports = app;
FILE_EOF

echo "Creation de server.js..."
cat > server.js << 'FILE_EOF'
require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectDB } = require('./src/config/db');

// Charger tous les modèles pour que Sequelize connaisse leurs relations avant sync()
require('./src/models/Departement');
require('./src/models/Employe');
require('./src/models/Pointage');
require('./src/models/User');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // alter: true met à jour les tables existantes pour correspondre aux modèles
  // (pas de système de migration formel, comme décidé)
  await sequelize.sync({ alter: true });
  console.log('Tables synchronisées avec les modèles.');

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
FILE_EOF

echo "Creation de seed.js..."
cat > seed.js << 'FILE_EOF'
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const { sequelize, connectDB } = require('./src/config/db');
const Employe = require('./src/models/Employe');
const Pointage = require('./src/models/Pointage');

const departements = ['Informatique', 'Ressources Humaines', 'Comptabilité', 'Logistique', 'Marketing', 'Production'];
const fonctionsParDepartement = {
  'Informatique': ['Développeur backend', 'Développeuse frontend', 'Administrateur système', 'Chef de projet IT'],
  'Ressources Humaines': ['Responsable RH', 'Chargé de recrutement', 'Gestionnaire de paie'],
  'Comptabilité': ['Comptable', 'Contrôleur de gestion', 'Auditeur interne'],
  'Logistique': ['Responsable stock', 'Magasinier', 'Coordinateur logistique'],
  'Marketing': ['Chargé de communication', 'Responsable marketing', 'Community manager'],
  'Production': ["Chef d'équipe", 'Technicien de production', 'Superviseur qualité'],
};
const villes = ['Antananarivo', 'Antsirabe', 'Toamasina', 'Fianarantsoa', 'Mahajanga', 'Toliara'];

const genererCIN = () => faker.string.numeric(12);
const genererMatricule = (index) => `EMP-${String(index).padStart(3, '0')}`;

const genererEmployeFictif = (index) => {
  const departement = faker.helpers.arrayElement(departements);
  const fonction = faker.helpers.arrayElement(fonctionsParDepartement[departement]);

  return {
    matricule: genererMatricule(index),
    cin: genererCIN(),
    nom: faker.person.lastName(),
    prenoms: faker.person.firstName(),
    departement,
    fonction,
    telephone: faker.phone.number({ style: 'national' }),
    adresse: faker.helpers.arrayElement(villes),
  };
};

const getJoursOuvresSemaine = () => {
  const jours = [];
  const aujourdhui = new Date();
  const jourSemaine = aujourdhui.getDay();
  const lundi = new Date(aujourdhui);
  const decalage = jourSemaine === 0 ? -6 : 1 - jourSemaine;
  lundi.setDate(aujourdhui.getDate() + decalage);

  for (let i = 0; i < 5; i++) {
    const jour = new Date(lundi);
    jour.setDate(lundi.getDate() + i);
    jours.push(jour.toISOString().split('T')[0]); // format YYYY-MM-DD pour DATEONLY
  }
  return jours;
};

const importerDonnees = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true }); // recrée les tables à chaque seed

    const nombreEmployes = faker.number.int({ min: 5, max: 10 });
    const employesFictifs = Array.from({ length: nombreEmployes }, (_, i) =>
      genererEmployeFictif(i + 1)
    );

    const employesCrees = await Employe.bulkCreate(employesFictifs);
    console.log(`${employesCrees.length} employés créés (aléatoire entre 5 et 10).`);

    const joursOuvres = getJoursOuvresSemaine();
    const pointagesFictifs = [];

    employesCrees.forEach((employe) => {
      joursOuvres.forEach((jour) => {
        const tauxPresence = faker.number.float({ min: 0.75, max: 0.95 });
        const present = Math.random() < tauxPresence;

        pointagesFictifs.push({
          employeId: employe.id,
          date: jour,
          arriveeMatin: present,
          departMatin: present && Math.random() > 0.05,
          arriveeApresMidi: present && Math.random() > 0.1,
          departApresMidi: present && Math.random() > 0.05,
        });
      });
    });

    const pointagesCrees = await Pointage.bulkCreate(pointagesFictifs);
    console.log(`${pointagesCrees.length} pointages créés.`);

    console.log('Import terminé avec succès !');
    process.exit();
  } catch (error) {
    console.error(`Erreur lors de l'import : ${error.message}`);
    process.exit(1);
  }
};

const supprimerDonnees = async () => {
  try {
    await connectDB();
    await Pointage.destroy({ where: {}, truncate: true });
    await Employe.destroy({ where: {}, truncate: true });
    console.log('Toutes les données ont été supprimées.');
    process.exit();
  } catch (error) {
    console.error(`Erreur lors de la suppression : ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  supprimerDonnees();
} else {
  importerDonnees();
}
FILE_EOF


echo ""
echo "Structure MySQL creee avec succes !"
echo "Etapes suivantes :"
echo "  1. npm install"
echo "  2. Copie .env.example en .env et renseigne tes identifiants MySQL"
echo "  3. Cree la base : CREATE DATABASE pointage;"
echo "  4. npm run dev"

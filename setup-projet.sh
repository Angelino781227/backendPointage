#!/bin/bash
# Script de structuration du projet pointage-backend
# A executer depuis la racine du projet (la ou se trouve package.json)
# Utilisation : bash setup-projet.sh   (ou ./setup-projet.sh apres chmod +x)

echo "Creation des dossiers..."
mkdir -p src/config src/models src/controllers src/routes src/middlewares

echo "Creation de src/config/db.js..."
cat > src/config/db.js << 'EOF'
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
EOF

echo "Creation de src/middlewares/errorHandler.js..."
cat > src/middlewares/errorHandler.js << 'EOF'
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
EOF

echo "Creation de src/models/Employe.js..."
cat > src/models/Employe.js << 'EOF'
const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: [true, 'Le matricule est obligatoire'],
      unique: true,
      trim: true,
    },
    cin: {
      type: String,
      required: [true, 'Le CIN est obligatoire'],
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    prenoms: {
      type: String,
      required: [true, 'Les prénoms sont obligatoires'],
      trim: true,
    },
    departement: {
      type: String,
      required: [true, 'Le département est obligatoire'],
      trim: true,
    },
    fonction: {
      type: String,
      required: [true, 'La fonction est obligatoire'],
      trim: true,
    },
    telephone: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employe', employeSchema);
EOF

echo "Creation de src/controllers/employeController.js..."
cat > src/controllers/employeController.js << 'EOF'
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
EOF

echo "Creation de src/routes/employeRoutes.js..."
cat > src/routes/employeRoutes.js << 'EOF'
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
EOF

echo "Creation de src/routes/testRoutes.js..."
cat > src/routes/testRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API de gestion de pointage opérationnelle 🚀' });
});

module.exports = router;
EOF

echo "Creation de src/app.js..."
cat > src/app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const testRoutes = require('./routes/testRoutes');
const employeRoutes = require('./routes/employeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/employes', employeRoutes);

app.use(errorHandler);

module.exports = app;
EOF

echo "Creation de server.js..."
cat > server.js << 'EOF'
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
EOF

echo ""
echo "Structure créée avec succès !"
echo "N'oublie pas : npm install, puis npm run dev"

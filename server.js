require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectDB } = require('./src/config/db');

// Charger tous les modèles pour que Sequelize connaisse leurs relations avant sync()
require('./models/Departement');
require('./models/Employe');
require('./models/Pointage');
require('./models/User');

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

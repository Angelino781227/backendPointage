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

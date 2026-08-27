require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Employe = require('./src/models/Employe');
const Pointage = require('./src/models/Pointage');

const employesFictifs = [
  {
    matricule: 'EMP-001',
    cin: '101021012345',
    nom: 'Rakoto',
    prenoms: 'Jean',
    departement: 'Informatique',
    fonction: 'Développeur backend',
    telephone: '034 12 345 67',
    adresse: 'Antananarivo',
  },
  {
    matricule: 'EMP-002',
    cin: '101021054321',
    nom: 'Rasoa',
    prenoms: 'Marie',
    departement: 'Ressources Humaines',
    fonction: 'Responsable RH',
    telephone: '033 98 765 43',
    adresse: 'Antananarivo',
  },
  {
    matricule: 'EMP-003',
    cin: '101021067890',
    nom: 'Andry',
    prenoms: 'Paul',
    departement: 'Comptabilité',
    fonction: 'Comptable',
    telephone: '032 11 223 34',
    adresse: 'Antsirabe',
  },
  {
    matricule: 'EMP-004',
    cin: '101021011223',
    nom: 'Voahangy',
    prenoms: 'Sarah',
    departement: 'Informatique',
    fonction: 'Développeuse frontend',
    telephone: '034 55 667 78',
    adresse: 'Antananarivo',
  },
  {
    matricule: 'EMP-005',
    cin: '101021099887',
    nom: 'Rabe',
    prenoms: 'Tovo',
    departement: 'Logistique',
    fonction: 'Responsable stock',
    telephone: '033 44 556 89',
    adresse: 'Toamasina',
  },
];

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
    jour.setHours(0, 0, 0, 0);
    jours.push(jour);
  }
  return jours;
};

const importerDonnees = async () => {
  try {
    await connectDB();

    await Employe.deleteMany();
    await Pointage.deleteMany();
    console.log('Anciennes données supprimées.');

    const employesCrees = await Employe.insertMany(employesFictifs);
    console.log(`${employesCrees.length} employés créés.`);

    const joursOuvres = getJoursOuvresSemaine();
    const pointagesFictifs = [];

    employesCrees.forEach((employe) => {
      joursOuvres.forEach((jour) => {
        const present = Math.random() > 0.15;

        pointagesFictifs.push({
          employe: employe._id,
          date: jour,
          arriveeMatin: present,
          departMatin: present,
          arriveeApresMidi: present && Math.random() > 0.1,
          departApresMidi: present && Math.random() > 0.1,
        });
      });
    });

    const pointagesCrees = await Pointage.insertMany(pointagesFictifs);
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
    await Employe.deleteMany();
    await Pointage.deleteMany();
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

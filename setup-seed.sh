#!/bin/bash
# Ajoute le script de seed dynamique (Faker) au projet
# A executer depuis la racine du projet (a cote de package.json)

echo "Creation de seed.js..."
cat > seed.js << 'EOF'
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const connectDB = require('./src/config/db');
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

    const nombreEmployes = faker.number.int({ min: 5, max: 10 });
    const employesFictifs = Array.from({ length: nombreEmployes }, (_, i) =>
      genererEmployeFictif(i + 1)
    );

    const employesCrees = await Employe.insertMany(employesFictifs);
    console.log(`${employesCrees.length} employés créés (aléatoire entre 5 et 10).`);

    const joursOuvres = getJoursOuvresSemaine();
    const pointagesFictifs = [];

    employesCrees.forEach((employe) => {
      joursOuvres.forEach((jour) => {
        const tauxPresence = faker.number.float({ min: 0.75, max: 0.95 });
        const present = Math.random() < tauxPresence;

        pointagesFictifs.push({
          employe: employe._id,
          date: jour,
          arriveeMatin: present,
          departMatin: present && Math.random() > 0.05,
          arriveeApresMidi: present && Math.random() > 0.1,
          departApresMidi: present && Math.random() > 0.05,
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
EOF

echo "Mise a jour de package.json (ajout des scripts seed)..."
if ! grep -q '"seed"' package.json; then
  sed -i.bak '/"dev":/a\
    "seed": "node seed.js",\
    "seed:destroy": "node seed.js -d",' package.json
  rm -f package.json.bak
  echo "Scripts seed ajoutes."
else
  echo "Les scripts seed existent deja dans package.json, rien a faire."
fi

echo ""
echo "Installation de @faker-js/faker..."
npm install --save-dev @faker-js/faker

echo ""
echo "Script de seed dynamique cree avec succes !"
echo "Utilisation :"
echo "  npm run seed          -> genere entre 5 et 10 employes ALEATOIRES + leurs pointages"
echo "  npm run seed:destroy  -> supprime toutes les donnees"

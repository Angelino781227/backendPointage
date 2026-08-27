# Pointage Backend

Backend Node.js / Express / MongoDB pour la gestion de pointage des employés.

## Installation

```bash
npm install
```

## Configuration

1. Copie `.env.example` en `.env`
2. Remplace `MONGO_URI` par ton URI de connexion MongoDB Atlas (récupérée dans Atlas > Connect > Drivers)
3. Remplace `<password>` dans l'URI par le mot de passe de ton utilisateur de base de données

## Démarrage

```bash
npm run dev
```

Puis ouvre : http://localhost:5000/api/test

Tu dois voir : `{ "message": "API de gestion de pointage opérationnelle 🚀" }`

## Structure

```
pointage-backend/
├── src/
│   ├── config/         → connexion MongoDB
│   ├── models/         → schémas Mongoose (Employé, Pointage...)
│   ├── controllers/    → logique métier
│   ├── routes/         → définition des endpoints
│   ├── middlewares/    → auth, gestion d'erreurs
│   └── app.js           → configuration Express
├── .env                 → variables d'environnement (non versionné)
├── .gitignore
└── server.js             → point d'entrée
```

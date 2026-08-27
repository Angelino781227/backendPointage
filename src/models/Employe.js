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

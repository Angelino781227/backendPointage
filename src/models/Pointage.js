const mongoose = require('mongoose');

const pointageSchema = new mongoose.Schema(
  {
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employe',
      required: [true, "L'employé est obligatoire"],
    },
    date: {
      type: Date,
      required: [true, 'La date est obligatoire'],
      validate: {
        validator: function (valeur) {
          const jour = valeur.getDay();
          return jour !== 0 && jour !== 6;
        },
        message: 'Le pointage ne peut concerner que les jours ouvrés (lundi à vendredi)',
      },
    },
    arriveeMatin: {
      type: Boolean,
      default: false,
    },
    departMatin: {
      type: Boolean,
      default: false,
    },
    arriveeApresMidi: {
      type: Boolean,
      default: false,
    },
    departApresMidi: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

pointageSchema.index({ employe: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Pointage', pointageSchema);

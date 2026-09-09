const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departement',
      required: [true, 'Le département est obligatoire'],
    },
    userRole: {
      type: Boolean,
      required: true,
      default: false, // false = utilisateur standard, true = administrateur
    },
    userLogin: {
      type: String,
      required: [true, "L'identifiant est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [6, "L'identifiant doit contenir au moins 3 caractères"],
    },
    userPassword: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('userPassword')) return next();

  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
  next();
});

// Méthode d'instance pour comparer un mot de passe en clair au hash stocké
userSchema.methods.comparerMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.userPassword);
};

module.exports = mongoose.model('User', userSchema);
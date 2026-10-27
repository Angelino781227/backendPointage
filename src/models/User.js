
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      
      userRole: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        // false = utilisateur standard
        // true = administrateur
      },

      userLogin: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "L'identifiant est obligatoire.",
          },
          len: {
            args: [3, 255],
            msg: "L'identifiant doit contenir entre 3 et 255 caractères.",
          },
        },
        set(value) {
          if (typeof value === 'string') {
            this.setDataValue('userLogin', value.trim().toLowerCase());
          } else {
            this.setDataValue('userLogin', value);
          }
        },
      },

      userPassword: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Le mot de passe est obligatoire.',
          },
        },
      },
    },
    {
      tableName: 'users',
      timestamps: true,

      // Ne pas exposer le hash par défaut.
      defaultScope: {
        attributes: {
          exclude: ['userPassword'],
        },
      },

      hooks: {
        beforeSave: async (user) => {
          // Ne hash que si le mot de passe a changé.
          if (!user.changed('userPassword')) {
            return;
          }

          const motDePasse = user.getDataValue('userPassword');

          if (typeof motDePasse !== 'string' || motDePasse.length < 12) {
            throw new Error(
              'Le mot de passe doit contenir au moins 12 caractères.'
            );
          }

          // bcrypt ne prend en compte que 72 octets au maximum.
          if (Buffer.byteLength(motDePasse, 'utf8') > 72) {
            throw new Error(
              'Le mot de passe ne doit pas dépasser 72 octets en UTF-8.'
            );
          }

          // Coût de calcul 12 : à ajuster selon les performances du serveur.
          const hash = await bcrypt.hash(motDePasse, 12);

          user.setDataValue('userPassword', hash);
        },
      },
    }
  );

  // Comparaison du mot de passe saisi avec le hash stocké.
  User.prototype.comparerMotDePasse = async function (motDePasseSaisi) {
    if (
      typeof motDePasseSaisi !== 'string' ||
      typeof this.userPassword !== 'string'
    ) {
      return false;
    }

    return bcrypt.compare(motDePasseSaisi, this.userPassword);
  };

  return User;
};

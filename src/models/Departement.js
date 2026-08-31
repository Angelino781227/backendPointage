const mongoose = require('mongoose');

const departementSchema = new mongoose.Schema(
    {
        idDepartement: {
            type: String,
            required: true,
            unique: true
        },
        nomDepartement: {
            type: String,
            required: true,
            unique: true
        },
        chefDepartement: {
            type: String,
            required: true,
        },
        nombreEmploye: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Departement', departementSchema);


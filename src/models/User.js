const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            autoIncrement: true,
            required: true,
            unique: true
        },
        typeUser: {

        },
        roleUser: {

        },
    }
);
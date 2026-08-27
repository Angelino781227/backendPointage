const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const testRoutes = require('./routes/testRoutes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

// Middleware de gestion d'erreurs (toujours en dernier)
app.use(errorHandler);

module.exports = app;

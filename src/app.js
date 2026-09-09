const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const testRoutes = require('./routes/testRoutes');
const employeRoutes = require('./routes/employeRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const userRoutes = require('./routes/userRoutes');
const departementRoutes = require('./routes/departementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departements', departementRoutes);

app.use(errorHandler);

module.exports = app;

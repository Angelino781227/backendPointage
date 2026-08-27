const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const testRoutes = require('./routes/testRoutes');
const employeRoutes = require('./routes/employeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/employes', employeRoutes);

app.use(errorHandler);

module.exports = app;

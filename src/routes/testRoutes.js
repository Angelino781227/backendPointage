const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API de gestion de pointage opérationnelle 🚀' });
});

module.exports = router;

const express = require('express');
const { getRules } = require('../engine/ruleEngine');

const router = express.Router();

router.get('/', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ rules: getRules() });
});

module.exports = router;

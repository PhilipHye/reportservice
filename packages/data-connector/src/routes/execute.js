const express = require('express');
const db = require('../db');
const registry = require('../registry');
const { validateParams } = require('../validate');

const router = express.Router();

// Shared-secret auth for the demo. In production this would be per-caller
// credentials, not a single static key.
function requireInternalAuth(req, res, next) {
  const key = req.header('x-internal-api-key');
  if (!key || key !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.post('/execute', requireInternalAuth, (req, res) => {
  const { query_id, params } = req.body || {};

  const query = registry[query_id];
  if (!query) {
    return res.status(404).json({ error: `Unknown query_id: ${query_id}` });
  }

  const { valid, errors, clean } = validateParams(params, query.paramsSchema);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid parameters', details: errors });
  }

  try {
    const rows = query.run(db, clean);
    res.json({ rows });
  } catch (err) {
    console.error(`[data-connector] query "${query_id}" failed:`, err.message);
    res.status(500).json({ error: 'Query execution failed' });
  }
});

module.exports = router;

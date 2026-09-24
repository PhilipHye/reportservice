const express = require('express');
const accountStatement = require('../reportDefinitions/account-statement.json');
const { fetchData } = require('../services/connectorClient');
const { render } = require('../services/carboneRenderer');

const router = express.Router();

// query_id -> report definition. One entry today; this is the seam
// where a "source" field and a Connector Registry get added once
// there's more than one backend system (see docs/multi-source-notes.md).
const definitions = {
  [accountStatement.id]: accountStatement,
};

router.post('/:reportId/run', async (req, res) => {
  const definition = definitions[req.params.reportId];
  if (!definition) {
    return res.status(404).json({ error: `Unknown report: ${req.params.reportId}` });
  }

  const params = {};
  for (const key of definition.params) {
    if (req.body[key] === undefined) {
      return res.status(400).json({ error: `Missing required parameter: ${key}` });
    }
    params[key] = req.body[key];
  }

  try {
    const rows = await fetchData(definition.connector_query_id, params);
    const fileBuffer = await render(definition.template, { ...params, rows });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${definition.id}.docx"`);
    res.send(fileBuffer);
  } catch (err) {
    console.error(`[report-service] report "${definition.id}" failed:`, err.message);
    const status = err.status && err.status < 500 ? err.status : 500;
    res.status(status).json({ error: err.message, details: err.details });
  }
});

module.exports = router;

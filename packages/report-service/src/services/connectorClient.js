const fetch = require('node-fetch');

const CONNECTOR_URL = process.env.CONNECTOR_URL || 'http://localhost:4001';

/**
 * Calls the Data Connector's guarded query endpoint. The Report Service
 * never sees a database connection or credentials — only rows come back.
 */
async function fetchData(queryId, params) {
  const res = await fetch(`${CONNECTOR_URL}/connector/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-api-key': process.env.INTERNAL_API_KEY,
    },
    body: JSON.stringify({ query_id: queryId, params }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Connector request failed (${res.status})`);
    err.status = res.status;
    err.details = body.details;
    throw err;
  }

  const { rows } = await res.json();
  return rows;
}

module.exports = { fetchData };

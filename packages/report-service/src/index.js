require('dotenv').config();
const express = require('express');
const reportsRoute = require('./routes/reports');

const app = express();
app.use(express.json());
app.use('/reports', reportsRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.REPORT_SERVICE_PORT || 4000;
app.listen(PORT, () => {
  console.log(`[report-service] listening on :${PORT}`);
});

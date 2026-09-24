require('dotenv').config();
const express = require('express');
const executeRoute = require('./routes/execute');

const app = express();
app.use(express.json());
app.use('/connector', executeRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.CONNECTOR_PORT || 4001;
app.listen(PORT, () => {
  console.log(`[data-connector] listening on :${PORT}`);
});

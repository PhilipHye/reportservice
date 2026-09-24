const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'demo.sqlite');

// Ensure the data directory exists (sqlite file lives here for the demo;
// in a real deployment this file is replaced by a connection to the real DB).
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

module.exports = db;

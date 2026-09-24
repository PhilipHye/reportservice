/**
 * Generates fake accounts and transactions so the demo runs with zero
 * external setup. Not real data, not connected to anything real —
 * purely for portfolio/demo purposes.
 */
require('dotenv').config();
const db = require('../src/db');

db.exec(`
  DROP TABLE IF EXISTS transactions;
  DROP TABLE IF EXISTS accounts;

  CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    holder_name TEXT NOT NULL
  );

  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );
`);

const accounts = [
  { id: 'ACC-1001', holder_name: 'Ada Okafor' },
  { id: 'ACC-1002', holder_name: 'Tunde Bakare' },
];

const insertAccount = db.prepare('INSERT INTO accounts (id, holder_name) VALUES (@id, @holder_name)');
const insertTxn = db.prepare(`
  INSERT INTO transactions (account_id, date, description, amount)
  VALUES (@account_id, @date, @description, @amount)
`);

const descriptions = [
  'POS Purchase - Supermarket', 'Salary Credit', 'ATM Withdrawal',
  'Airtime Purchase', 'Transfer to Savings', 'Utility Bill Payment',
  'Transfer from Friend', 'Online Subscription', 'Fuel Purchase',
];

const insertAll = db.transaction(() => {
  for (const acc of accounts) {
    insertAccount.run(acc);

    // ~2-3 transactions per week for a year = enough to show pagination/volume
    let date = new Date('2025-10-01');
    const end = new Date('2026-09-24');

    while (date <= end) {
      const txnsThisWeek = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < txnsThisWeek; i++) {
        const isCredit = Math.random() < 0.25;
        const amount = isCredit
          ? Math.round((5000 + Math.random() * 45000) * 100) / 100
          : -Math.round((500 + Math.random() * 8000) * 100) / 100;

        insertTxn.run({
          account_id: acc.id,
          date: date.toISOString().slice(0, 10),
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          amount,
        });
      }
      date.setDate(date.getDate() + 7);
    }
  }
});

insertAll();

console.log('Seeded demo accounts:', accounts.map(a => a.id).join(', '));
console.log('Try account_id=ACC-1001, from_date=2026-01-01, to_date=2026-03-31');

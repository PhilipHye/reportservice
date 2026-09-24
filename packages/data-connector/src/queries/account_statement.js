/**
 * This file is the whole point of the Data Connector: a fixed, reviewed
 * SQL query with a declared parameter schema. The Report Service can only
 * ever trigger THIS query, with THESE parameters — never arbitrary SQL.
 *
 * The running balance is computed here, in SQL, rather than relying on
 * Carbone's aggregator formatters — those (aggSum/cumSum) are an Enterprise
 * feature in Carbone's free/embedded edition, so balance calculation is
 * kept in the data layer, which is arguably the right place for it anyway.
 */

const paramsSchema = {
  account_id: { type: 'string', required: true },
  from_date: { type: 'date', required: true }, // 'YYYY-MM-DD'
  to_date: { type: 'date', required: true },
};

// SQLite supports window functions (3.25+), so the running balance
// is computed directly in the query using SUM() OVER (...).
const sql = `
  SELECT
    t.id,
    t.date,
    t.description,
    t.amount,
    SUM(t.amount) OVER (
      PARTITION BY t.account_id
      ORDER BY t.date, t.id
    ) AS running_balance
  FROM transactions t
  WHERE t.account_id = @account_id
    AND t.date BETWEEN @from_date AND @to_date
  ORDER BY t.date, t.id;
`;

/**
 * @param {import('better-sqlite3').Database} db
 * @param {{account_id: string, from_date: string, to_date: string}} params
 */
function run(db, params) {
  const stmt = db.prepare(sql);
  return stmt.all(params);
}

module.exports = { id: 'account_statement', paramsSchema, run };

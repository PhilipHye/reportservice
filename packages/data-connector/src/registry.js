// The Connector's query registry: query_id -> module. Adding a new
// approved query means adding one entry here, not opening up SQL access.
const accountStatement = require('./queries/account_statement');

const registry = {
  [accountStatement.id]: accountStatement,
};

module.exports = registry;

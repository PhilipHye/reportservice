const path = require('path');
const carbone = require('carbone');

/**
 * Wraps Carbone's callback-based render() in a Promise.
 * Balance/aggregation values are expected to already be computed
 * upstream (in the Data Connector's SQL) — this just merges data
 * into the template, which is all the free/embedded Carbone edition
 * needs to do here.
 */
function render(templateRelativePath, data) {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, '..', '..', templateRelativePath);
    carbone.render(templatePath, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = { render };

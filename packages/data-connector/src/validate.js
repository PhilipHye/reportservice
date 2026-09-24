/**
 * Minimal, dependency-free parameter validation against a query's
 * declared schema. Good enough for MVP; swap for a schema library
 * (zod/ajv) once there's more than one or two query shapes.
 */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateParams(params, schema) {
  const errors = [];
  const clean = {};

  for (const [key, rule] of Object.entries(schema)) {
    const value = params ? params[key] : undefined;

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`Missing required parameter: ${key}`);
      continue;
    }
    if (value === undefined) continue;

    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`Parameter "${key}" must be a string`);
      continue;
    }
    if (rule.type === 'date' && !DATE_RE.test(value)) {
      errors.push(`Parameter "${key}" must be a date in YYYY-MM-DD format`);
      continue;
    }

    clean[key] = value;
  }

  return { valid: errors.length === 0, errors, clean };
}

module.exports = { validateParams };

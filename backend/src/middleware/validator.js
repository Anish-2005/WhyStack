const Ajv = require('ajv');
const path = require('path');

const ajv = new Ajv({ allErrors: true, strict: false });

function loadSchema(name) {
  const p = path.join(__dirname, '..', 'schemas', name);
  return require(p);
}

function validateSchema(schemaName) {
  const schema = loadSchema(schemaName);
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const ok = validate(req.body);
    if (!ok) return res.status(400).json({ error: 'validation error', details: validate.errors });
    next();
  };
}

module.exports = { validateSchema };

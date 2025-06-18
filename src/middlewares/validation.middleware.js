const { ValidationError } = require("../utils/errors/types/Api.error");
const loggingService = require("../services/logging.service");
const logger = loggingService.getLogger();
const Yup = require("yup");

/**
 * Creates a middleware function that validates request data against a Yup schema.
 * This middleware supports validating a single source (body, query, or params)
 * or multiple sources by providing a map of schemas.
 *
 * @param {object|Yup.Schema|object<string, Yup.Schema|object>} schema - A Yup schema for a single source,
 * or an object mapping source names ('body', 'query', 'params') to their respective Yup schemas or plain objects.
 * @param {string} [source='body'] - The request property to validate when a single schema is provided.
 * @returns {Function} An Express middleware function.
 */
const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      // Helper function to convert plain objects to Yup schemas if needed
      const toYupSchema = (schemaDef) => {
        if (typeof schemaDef?.validate === "function") {
          return schemaDef; // Already a Yup schema
        }
        return Yup.object().shape(schemaDef); // Convert plain object to Yup schema
      };

      // Check if the provided 'schema' is a schema map
      const isSchemaMap =
        typeof schema === "object" &&
        !schema.validateSync &&
        !schema.__isYupSchema__;

      if (isSchemaMap) {
        const allErrors = [];

        for (const [src, schemaDef] of Object.entries(schema)) {
          if (req[src] !== undefined) {
            try {
              const schemaObj = toYupSchema(schemaDef);
              await schemaObj.validate(req[src], { abortEarly: false });
            } catch (error) {
              if (Array.isArray(error.errors)) {
                allErrors.push(...error.errors.map((err) => `[${src}] ${err}`));
              } else {
                allErrors.push(`[${src}] ${error.message}`);
              }
            }
          }
        }

        if (allErrors.length > 0) {
          logger.warn("Validation errors from multiple sources:", allErrors);
          throw new ValidationError(allErrors);
        }
      } else {
        try {
          const schemaObj = toYupSchema(schema);
          await schemaObj.validate(req[source], { abortEarly: false });
        } catch (error) {
          const errors = error.errors || [error.message];
          logger.warn(`Validation errors for '${source}':`, errors);
          throw new ValidationError(errors);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;

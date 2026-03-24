import fs from 'fs';
import dotenv from 'dotenv';
import { EnvSchema, loadSchema } from './schema';
import * as validator from 'validator';

// Load environment variables from file
export const loadEnvFile = (envPath: string): Record<string, string> => {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  return envConfig;
};

// Validate individual value based on schema rule
export const validateValue = (value: string, rule: NonNullable<EnvSchema[string]>): { isValid: boolean; error?: string } => {
  // Check format
  if (rule.format) {
    switch (rule.format) {
      case 'url':
        // Accepter les URLs PostgreSQL et autres formats d'URL courants
        if (!validator.isURL(value, { require_protocol: true }) && !/^postgresql:\/\//.test(value) && !/^mysql:\/\//.test(value) && !/^mongodb:\/\//.test(value)) {
          return { isValid: false, error: `Value "${value}" is not a valid URL` };
        }
        break;
      case 'email':
        if (!validator.isEmail(value)) {
          return { isValid: false, error: `Value "${value}" is not a valid email` };
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          return { isValid: false, error: `Value "${value}" is not a valid number` };
        }
        
        const numValue = Number(value);
        if (rule.min !== undefined && numValue < rule.min) {
          return { isValid: false, error: `Number ${numValue} is less than minimum ${rule.min}` };
        }
        
        if (rule.max !== undefined && numValue > rule.max) {
          return { isValid: false, error: `Number ${numValue} is greater than maximum ${rule.max}` };
        }
        break;
      case 'boolean':
        if (value.toLowerCase() !== 'true' && value.toLowerCase() !== 'false') {
          return { isValid: false, error: `Value "${value}" is not a valid boolean` };
        }
        break;
      case 'json':
        try {
          JSON.parse(value);
        } catch (e) {
          return { isValid: false, error: `Value "${value}" is not valid JSON` };
        }
        break;
      case 'uuid':
        // Valider UUID v1, v4, v5
        if (!validator.isUUID(value, 'all')) {
          return { isValid: false, error: `Value "${value}" is not a valid UUID` };
        }
        break;
      case 'regex':
        // Valider avec un pattern regex personnalisé
        if (!rule.pattern) {
          return { isValid: false, error: `Regex format requires a pattern property` };
        }
        try {
          const regex = new RegExp(rule.pattern);
          if (!regex.test(value)) {
            return { isValid: false, error: `Value "${value}" does not match pattern ${rule.pattern}` };
          }
        } catch (e) {
          return { isValid: false, error: `Invalid regex pattern: ${(e as Error).message}` };
        }
        break;
      case 'date':
        // Valider une date ISO 8601
        const date = new Date(value);
        if (isNaN(date.getTime()) || value !== date.toISOString().split('T')[0]) {
          return { isValid: false, error: `Value "${value}" is not a valid ISO 8601 date` };
        }
        break;
      case 'datetime':
        // Valider une datetime ISO 8601
        const datetime = new Date(value);
        if (isNaN(datetime.getTime())) {
          return { isValid: false, error: `Value "${value}" is not a valid ISO 8601 datetime` };
        }
        // Vérifier que c'est bien au format ISO
        if (value !== datetime.toISOString()) {
          // Essayez différents formats courants
          const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
          if (!isoRegex.test(value)) {
            return { isValid: false, error: `Value "${value}" is not a valid ISO 8601 datetime` };
          }
        }
        break;
      case 'port':
        // Valider un port réseau (1-65535)
        const portNum = parseInt(value, 10);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
          return { isValid: false, error: `Value "${value}" is not a valid port number (1-65535)` };
        }
        break;
      case 'host':
        // Valider hostname ou IP
        if (!validator.isIP(value) && !validator.isFQDN(value)) {
          // Vérifier aussi si c'est localhost ou un hostname simple
          const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
          if (!hostnameRegex.test(value) && value !== 'localhost') {
            return { isValid: false, error: `Value "${value}" is not a valid hostname or IP address` };
          }
        }
        break;
      case 'semver':
        // Valider semantic versioning (ex: 1.0.0)
        const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
        if (!semverRegex.test(value)) {
          return { isValid: false, error: `Value "${value}" is not a valid semantic version (e.g., 1.0.0)` };
        }
        break;
      case 'hex':
        // Valider couleur hexadécimale (#fff, #ffffff)
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(value)) {
          return { isValid: false, error: `Value "${value}" is not a valid hex color (e.g., #fff or #ffffff)` };
        }
        break;
      case 'base64':
        // Valider string base64
        if (!validator.isBase64(value)) {
          return { isValid: false, error: `Value "${value}" is not a valid base64 string` };
        }
        break;
      case 'string':
      default:
        // Additional string validations
        if (rule.min_length !== undefined && value.length < rule.min_length) {
          return { isValid: false, error: `String length ${value.length} is less than minimum ${rule.min_length}` };
        }
        
        if (rule.max_length !== undefined && value.length > rule.max_length) {
          return { isValid: false, error: `String length ${value.length} is greater than maximum ${rule.max_length}` };
        }
        break;
    }
  }

  return { isValid: true };
};

// Validate environment variables against schema
export const validateEnvAgainstSchema = (
  envPath: string,
  schemaPath: string
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const envVars = loadEnvFile(envPath);
  const schema = loadSchema(schemaPath);

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check all required variables are present
  Object.entries(schema).forEach(([key, rule]) => {
    const value = envVars[key];
    
    // Check if required
    if (rule.required) {
      if (value === undefined) {
        // Check if there's a default value
        if (rule.default !== undefined) {
          // Use default value
          warnings.push(`Using default value for ${key}: ${rule.default}`);
        } else {
          errors.push(`Required environment variable missing: ${key}`);
        }
      } else {
        // Validate the value
        const validationResult = validateValue(value, rule);
        if (!validationResult.isValid) {
          errors.push(`Validation failed for ${key}: ${validationResult.error}`);
        }
      }
    } else {
      // Variable is optional
      if (value !== undefined) {
        // Validate the value if it exists
        const validationResult = validateValue(value, rule);
        if (!validationResult.isValid) {
          errors.push(`Validation failed for ${key}: ${validationResult.error}`);
        }
      }
    }
  });

  // Check for variables in env that aren't in schema (not an error by default, but could warn)
  Object.keys(envVars).forEach(key => {
    if (!(key in schema)) {
      warnings.push(`Environment variable ${key} is not defined in schema`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
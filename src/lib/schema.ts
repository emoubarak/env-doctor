import fs from 'fs';
import yaml from 'js-yaml';

// Define the schema structure
export interface SchemaRule {
  required?: boolean;
  default?: string;
  format?: 'string' | 'number' | 'url' | 'email' | 'boolean' | 'json';
  min?: number;
  max?: number;
  min_length?: number;
  max_length?: number;
}

export interface EnvSchema {
  [key: string]: SchemaRule;
}

export const loadSchema = (schemaPath: string): EnvSchema => {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const schema = yaml.load(schemaContent) as EnvSchema;

  if (!schema || typeof schema !== 'object') {
    throw new Error('Invalid schema format');
  }

  return schema;
};
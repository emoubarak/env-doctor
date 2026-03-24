import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { validateEnvAgainstSchema } from '../lib/validator';

export const checkCommand = (program: Command) => {
  program
    .command('check')
    .description('Validate .env file against .env.schema.yaml')
    .option('-f, --file <path>', 'path to .env file', '.env')
    .option('-s, --schema <path>', 'path to schema file', '.env.schema.yaml')
    .action((options) => {
      const envFilePath = options.file;
      const schemaPath = options.schema;

      try {
        const { isValid, errors, warnings } = validateEnvAgainstSchema(envFilePath, schemaPath);

        if (warnings.length > 0) {
          console.log('Warnings:');
          warnings.forEach(warning => console.log(`  - ${warning}`));
          console.log('');
        }

        if (!isValid) {
          console.log('Validation failed. Errors found:');
          errors.forEach(error => console.log(`  - ${error}`));
          process.exit(1);
        } else {
          console.log('✓ All environment variables are valid!');
        }
      } catch (error: any) {
        console.error('Error during validation:', error.message);
        process.exit(1);
      }
    });
};
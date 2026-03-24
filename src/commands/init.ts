import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { loadEnvFile } from '../lib/validator';
import yaml from 'js-yaml';

export const initCommand = (program: Command) => {
  program
    .command('init')
    .description('Scan .env file and generate .env.schema.yaml')
    .option('-f, --file <path>', 'path to .env file', '.env')
    .option('-o, --output <path>', 'output schema file', '.env.schema.yaml')
    .action((options) => {
      const envFilePath = options.file;
      const schemaPath = options.output;

      try {
        if (!fs.existsSync(envFilePath)) {
          console.log(`No ${envFilePath} file found. Creating empty schema template.`);
          
          const emptySchema = {};
          fs.writeFileSync(schemaPath, yaml.dump(emptySchema));
          console.log(`Created empty schema file: ${schemaPath}`);
          return;
        }

        const envVars = loadEnvFile(envFilePath);
        
        // Generate schema with basic structure
        const schema: Record<string, any> = {};
        Object.keys(envVars).forEach(key => {
          schema[key] = {
            required: true,
            format: 'string' // default format
          };
        });

        fs.writeFileSync(schemaPath, yaml.dump(schema));
        console.log(`Generated schema file: ${schemaPath}`);
        console.log(`Found ${Object.keys(envVars).length} environment variables`);
      } catch (error: any) {
        console.error('Error generating schema:', error.message);
        process.exit(1);
      }
    });
};
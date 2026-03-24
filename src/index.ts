#!/usr/bin/env node

import { program } from 'commander';
import { initCommand } from './commands/init';
import { checkCommand } from './commands/check';

program
  .name('env-doctor')
  .description('CLI tool to validate environment variables via .env.schema file')
  .version('1.0.0');

initCommand(program);
checkCommand(program);

program.parse(process.argv);
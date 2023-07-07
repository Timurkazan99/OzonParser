#!/usr/bin/env node

import { Command } from 'commander';
import ozonParse from '../src/index.js';
import path from "path";

const program = new Command();

program
  .version('0.0.1')
  .description('Play battles')
  .arguments('<filepath>')
  .arguments('<readCol>')
  .arguments('<writeCol>')
  .option('-c, --category <char>', 'category column')
  .option('-d, --debug', 'add browser')
  .action((filepath, readCol, writeCol, options) => {
    if(options?.category) {
      console.log('Запуск поиска с категорией')
    }
    ozonParse(path.resolve(process.cwd(), filepath), readCol, writeCol, options.category, options.debug);
  })
  .parse();
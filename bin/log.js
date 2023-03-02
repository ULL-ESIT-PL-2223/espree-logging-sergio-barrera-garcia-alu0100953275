#!/usr/bin/env node

import { program } from "commander";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version, description } = require("../package.json");
import { transpile } from "../src/logging-espree.js";

program
  .name("logging-espree")
  .version(version)
  .description(description)
  .usage('[options] <filename> [...]')
  .argument("[filename]", 'file with the original code')
  .option("-o, --output <filename>", "file in which to write the output", "salida.js")
  .action((filename, options) => {
    if (filename) {
      transpile(filename, options.output);
    } else {
      program.help();
    }
  });

program.parse(process.argv);

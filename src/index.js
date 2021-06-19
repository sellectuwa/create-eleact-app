#!/usr/bin/env node

if (process.versions.node.split('.')[0] < 10) {
  console.error(
    `You are running Node ${process.versions.node}.\n` +
      `Create Eleact App requires Node 10 or higher. \n` +
      `Please update your version of Node.`,
  );
  process.exit(1);
}

const cli = require('./createEleactApp');

cli();

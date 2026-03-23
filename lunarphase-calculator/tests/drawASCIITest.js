const drawASCII = require("../src/ASCII-arts/drawASCII");
const phases = require("../src/phases.json");

const phasesObject = JSON.parse(JSON.stringify(phases));
const phasesValues = Object.values(phasesObject);

// eslint-disable-next-line no-restricted-syntax
for (const value of phasesValues) {
  process.stdout.write(`\t${value}\n${drawASCII(value)}`);
}

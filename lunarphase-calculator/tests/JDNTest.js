const { toJDN, fromJDN } = require("../src/calculations/julianDayNumber");
const randomDate = require("./randomDate");

// Grigorian Calendar
for (let i = 0; i < 500; i++) {
  const date = randomDate();
  const jdn = toJDN(date);
  const fromjdn = fromJDN(jdn);
  process.stdout.write(`${date}: ${jdn}: ${fromjdn} \n`);
}

// Julian Calendar
for (let i = 0; i < 500; i++) {
  const date = randomDate();
  const jdn = toJDN(date, false);
  const fromjdn = fromJDN(jdn, false);
  process.stdout.write(`${date}: ${jdn}: ${fromjdn} \n`);
}

const randomDate = require("./randomDate");
const { getLunarDay, getLunarPhase } = require("../src/calculations/getLunarPhase");

for (let i = 0; i < 500; i++) {
  const date = randomDate();
  const lunarDay = getLunarDay(date);
  const lunarPhase = getLunarPhase(lunarDay);
  process.stdout.write(`${date}: ${lunarDay}: ${lunarPhase} \n`);
}

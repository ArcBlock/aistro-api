const { getLunarDay, getLunarPhase } = require("./getLunarPhase");
const drawASCII = require("../ASCII-arts/drawASCII");

function getFullLunarPhase(date = new Date()) {
  const ISOdate = date.toISOString().substring(0, 10);
  const lunarDay = getLunarDay(date);
  const phase = getLunarPhase(lunarDay);
  const ASCIIArt = drawASCII(phase);

  return `\t${ISOdate}  \n\t${phase} \n\n${ASCIIArt}`;
}

module.exports = getFullLunarPhase;

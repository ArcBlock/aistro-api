const { getLunarDay, getLunarPhase } = require("./getLunarPhase");

function getLunarPhaseMonth(date = new Date()) {
  function getDaysInMonth(year, month) {
    return 30 + (month === 2 ? (year % 4 === 0 && 1) - 2 : (month + Number(month > 7)) % 2);
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const phases = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const thisDate = new Date(year, month, i);
    const lunarDay = getLunarDay(thisDate);
    const phase = getLunarPhase(lunarDay);
    phases.push(phase);
  }

  return phases;
}

module.exports = getLunarPhaseMonth;

// counting lunar phase

const constants = require("./constants.json");
const phases = require("../phases.json");
const { toJDN } = require("./julianDayNumber");
const InvalidLunarDayError = require("../exceptions/InvalidLunarDayError");
const InvalidDateObjectError = require("../exceptions/InvalidDateObjectError");

function getLunarDay(date = new Date()) {
  function normalize(percentage) {
    const x = percentage - Math.floor(percentage);
    const normalizedPercentage = x < 0 ? x + 1 : x;
    return normalizedPercentage;
  }

  function isValidDateObject(validatedDate) {
    return Boolean(validatedDate && Object.prototype.toString.call(validatedDate) === "[object Date]" && !Number.isNaN(validatedDate));
  }

  if (!isValidDateObject(date)) throw new InvalidDateObjectError();

  const jdn = toJDN(date);
  const lunarDayPercentage = (jdn - constants.START_DATE) / constants.SYNODIC_MONTH;
  const normalizedLunarDayPercentage = normalize(lunarDayPercentage);
  const lunarDay = (normalizedLunarDayPercentage) * constants.SYNODIC_MONTH;
  return lunarDay;
}

function getLunarPhase(lunarDay = getLunarDay()) {
  if (lunarDay < constants.WAXING_CRESCENT_ID) return phases.NEW_MOON;
  if (lunarDay < constants.FIRST_QUARTER_ID) return phases.WAXING_CRESCENT;
  if (lunarDay < constants.WAXING_GIBBOUS_ID) return phases.FIRST_QUARTER;
  if (lunarDay < constants.FULL_MOON_ID) return phases.WAXING_GIBBOUS;
  if (lunarDay < constants.WANING_GIBBOUS_ID) return phases.FULL_MOON;
  if (lunarDay < constants.LAST_QUARTER_ID) return phases.WANING_GIBBOUS;
  if (lunarDay < constants.WANING_CRESCENT_ID) return phases.LAST_QUARTER;
  if (lunarDay < constants.NEW_MOON_UPPER_ID) return phases.WANING_CRESCENT;
  if (lunarDay < constants.NEW_MOON_UPPER_END_ID) return phases.NEW_MOON;
  throw new InvalidLunarDayError();
}

module.exports = { getLunarDay, getLunarPhase };

/* eslint-disable no-unreachable */

// drawing ASCII-art of the moon
const { getLunarPhase } = require("../calculations/getLunarPhase");
const phases = require("../phases.json");
const ASCIIarts = require("./ASCII-arts.json");
const DrawASCIIAccessError = require("../exceptions/DrawASCIIAccessError");

function drawASCII(lunarPhase = getLunarPhase()) {
  switch (lunarPhase) {
    case phases.NEW_MOON: return ASCIIarts.NEW_MOON; break;
    case phases.WAXING_CRESCENT: return ASCIIarts.WAXING_CRESCENT; break;
    case phases.FIRST_QUARTER: return ASCIIarts.FIRST_QUARTER; break;
    case phases.WAXING_GIBBOUS: return ASCIIarts.WAXING_GIBBOUS; break;
    case phases.FULL_MOON: return ASCIIarts.FULL_MOON; break;
    case phases.WANING_GIBBOUS: return ASCIIarts.WANING_GIBBOUS; break;
    case phases.LAST_QUARTER: return ASCIIarts.LAST_QUARTER; break;
    case phases.WANING_CRESCENT: return ASCIIarts.WANING_CRESCENT; break;
    default: throw new DrawASCIIAccessError();
  }
}

module.exports = drawASCII;

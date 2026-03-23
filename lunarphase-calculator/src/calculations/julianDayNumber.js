const InvalidDateObjectError = require("../exceptions/InvalidDateObjectError");
const InvalidJDNError = require("../exceptions/InvalidJDNError");

function isValidDateObject(date) {
  return Boolean(date && Object.prototype.toString.call(date) === "[object Date]" && !Number.isNaN(date));
}

function isValidJDN(JDN) {
  return Boolean(typeof JDN === "number" && JDN > 0);
}

// converting from Grigorian Calendar Date or Julian Calendar Date to Julian Date Number
function toJDN(date = new Date(), isGrigorian = true) {
  if (!isValidDateObject(date)) throw new InvalidDateObjectError();
  if (typeof isGrigorian !== "boolean") isGrigorian = true;

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getFullYear();

  const a = Math.trunc((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const b = Math.trunc((153 * m + 2) / 5);
  const c = Math.trunc(y / 4);
  const d = Math.trunc(y / 100);
  const e = Math.trunc(y / 400);

  const JDN = isGrigorian ? day + b + 365 * y + c - d + e - 32045
    : day + b + 365 * y + c - 32083;

  return JDN;
}

// converting from JDN to Grigorian Calendar Date or Julian Calendar Date
function fromJDN(JDN = toJDN(), isGrigorian = true) {
  if (!isValidJDN(JDN)) throw new InvalidJDNError();
  if (typeof isGrigorian !== "boolean") isGrigorian = true;

  if (isGrigorian) {
    const a = JDN + 32044;
    const b = Math.trunc((4 * a + 3) / 146097);
    const c = a - Math.trunc((146097 * b) / 4);
    const d = Math.trunc((4 * c + 3) / 1461);
    const e = c - Math.trunc((1461 * d) / 4);
    const m = Math.trunc((5 * e + 2) / 153);
    const n = Math.trunc((153 * m + 2) / 5);
    const o = Math.trunc(m / 10);

    const day = e - n + 1;
    const month = m + 3 - 12 * o - 1;
    const year = 100 * b + d - 4800 + o;

    return [year, month, day];
  }

  const a = JDN + 32082;
  const d = Math.trunc((4 * a + 3) / 1461);
  const e = a - Math.trunc((1461 * d) / 4);
  const m = Math.trunc((5 * e + 2) / 153);
  const n = Math.trunc((153 * m + 2) / 5);
  const o = Math.trunc(m / 10);

  const day = e - n + 1;
  const month = m + 3 - 12 * o;
  const year = d - 4800 + o;

  return [year, month, day];
}

module.exports = { toJDN, fromJDN };

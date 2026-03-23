class InvalidLunarDayError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidLunarDayError";
    if (!message) this.message = "Invalid lunar day number was received";
  }
}

module.exports = InvalidLunarDayError;

class InvalidDateObjectError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidDateObjectError";
    if (!message) this.message = "invalid Date Object was received";
  }
}

module.exports = InvalidDateObjectError;

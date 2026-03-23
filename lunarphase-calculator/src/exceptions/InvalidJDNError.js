class InvalidJDNError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidJDNError";
    if (!message) this.message = "Invalid Julian Date Number was received";
  }
}

module.exports = InvalidJDNError;

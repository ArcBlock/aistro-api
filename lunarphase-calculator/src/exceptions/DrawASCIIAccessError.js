class drawASCIIAccessError extends Error {
  constructor(message) {
    super(message);
    this.name = "drawASCIIAccessError";
    if (!message) this.message = "Cannot access to the ASCII-art";
  }
}

module.exports = drawASCIIAccessError;

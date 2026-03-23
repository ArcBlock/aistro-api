function randomDate() {
  const startDate = new Date(Date.UTC(0, 0, 1));
  const endDate = new Date(Date.UTC(5000, 12, 30));
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
}

module.exports = randomDate;

function sum(a, b) {
  arguments.forEach = [].forEach;
  arguments.forEach((value) => {
    if (typeof value !== 'number') {
      throw new TypeError(`${value} is not a number`);
    }
  });

  return a + b;
}

module.exports = sum;

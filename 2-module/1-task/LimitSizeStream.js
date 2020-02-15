const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit || 2 ** 8;
    this.current = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.current >= this.limit) {
      this.emit('error', new LimitExceededError());
      return;
    }

    this.current++;
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

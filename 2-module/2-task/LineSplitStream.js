const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.counter = 0;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk;
    callback(null);
  }

  _flush(callback) {
    const dataArray = this.buffer.toString().split(os.EOL);

    for (const chunk of dataArray) {
      this.emit('data', chunk);
    }
    callback(null);
  }
}

module.exports = LineSplitStream;

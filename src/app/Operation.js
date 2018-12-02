const EventEmitter = require('events');
const define = Object.defineProperty;

class Operation extends EventEmitter {
  static setOutputs(outputs) {
    define(this.prototype, 'outputs', {
      value: outputs
    });
  }

  on(output, handler) {
    if(this.outputs.includes(output)) {
      return this.addListener(output, handler);
    }
    throw new Error(`Invalid output "${output.toString()}" to operation ${this.constructor.name}.`);
  }
}

module.exports = Operation;

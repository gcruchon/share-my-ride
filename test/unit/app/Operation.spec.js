const { expect } = require('chai');
const Operation = require('src/app/Operation');

describe('App :: Operation', () => {
  var CustomOperation;

  beforeEach(() => {
    CustomOperation = class CustomOperation extends Operation { };
    CustomOperation.setOutputs([Symbol('SUCCESS')]);
  });

  describe('#on', () => {
    context('when added handler for a valid output', () => {
      it('does not throw', () => {
        const operation = new CustomOperation();
        const [SUCCESS] = operation.outputs;

        expect(() => {
          operation.on(SUCCESS, () => { });
        }).to.not.throw;
      });
    });

    context('when added handler for a invalid output', () => {
      it('does not throw', () => {
        const operation = new CustomOperation();

        expect(() => {
          operation.on(Symbol('INVALID'), () => { });
        }).to.throw(Error, /Invalid output "Symbol\(INVALID\)" to operation CustomOperation./);
      });
    });
  });
});

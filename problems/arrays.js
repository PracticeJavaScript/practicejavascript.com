const assert = require('chai').assert;

module.exports = [

  {
    name: 'Create Array',
    prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
    answer: `const fruits = ['apple', 'banana'];\rreturn fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        type: 'assertCorrectOutput',
        test: function(output) {
          return (assert.deepEqual(output, ['apple', 'banana']) === undefined);
        }
      }
    ]
  }

];

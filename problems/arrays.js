const assert = require('chai').assert;

module.exports = [

  {
    name: 'Create Array',
    prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
    answer: `const fruits = ['Apple', 'Banana'];\rreturn fruits;`,
    correctOutput: `['apple', 'banana']`,
    tests: [
      {
        name: 'Output must be correct',
        test: function() {
          return assert.deepEqual(output, correctOutput) === undefined;
        }
      },
      {
        name: 'Must use var, let, or const',
        test: function() {
          return parsed.body[0].declarations[0].init.type === 'Identifier';
        }
      },
      {
        name: 'Must use an Array',
        test: function() {
          return parsed.body[0].declarations[0].init.type === 'ArrayExpression';
        }
      },
      {
        name: 'Array must have 2 items in it',
        test: function() {
          return parsed.body[0].declarations[0].init.elements.length === 2;
        }
      },
      {
        name: 'First item in Array must be \'apple\'',
        test: function() {
          return parsed.body[0].declarations[0].init.elements[0].value === 'apple';
        }
      },
      {
        name: 'Second item in Array must be \'banana\'',
        test: function() {
          return parsed.body[0].declarations[0].init.elements[1].value === 'banana';
        }
      }
    ]
  }

];

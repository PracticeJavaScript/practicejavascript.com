const assert = require('chai').assert;

module.exports = [

  {
    name: 'Create Array',
    prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
    answer: `const fruits = ['apple', 'banana'];\rreturn fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, ['apple', 'banana']) === undefined);
        }
      },
      {
        name: 'Must return an Array',
        test: function(output) {
          return (assert.isArray(output) === undefined);
        }
      },
      {
        name: 'Array must have 2 items',
        test: function(output) {
          return (assert.lengthOf(output, 2) === undefined);
        }
      }
    ]
  },
  {
    name: 'Access Array item by index (first)',
    prompt: 'Return the first value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];\rreturn fruits[0];`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, 'apple') === undefined);
        }
      },
      {
        name: 'Must return a String',
        test: function(output) {
          return (assert.isString(output) === undefined);
        }
      }
    ]
  },
  {
    name: 'Access Array item by index (second)',
    prompt: 'Return the second value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];\rreturn fruits[1];`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, 'banana') === undefined);
        }
      },
      {
        name: 'Must return a String',
        test: function(output) {
          return (assert.isString(output) === undefined);
        }
      }
    ]
  },
  {
    name: 'Loop over array',
    prompt: 'Loop over the array, add an \'x\' to the end of each name, and push each fruit into a new array, then return the new array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];\rconst newFruits = [];\rfruits.forEach(function(item) {\r  newFruits.push(item+'x');\r});\rreturn newFruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, ['applex', 'bananax']) === undefined);
        }
      },
      {
        name: 'Must return an Array',
        test: function(output) {
          return (assert.isArray(output) === undefined);
        }
      },
      {
        name: 'Array must have 2 items',
        test: function(output) {
          return (assert.lengthOf(output, 2) === undefined);
        }
      }
    ]
  }

];

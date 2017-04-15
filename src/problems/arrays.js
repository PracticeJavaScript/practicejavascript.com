const assert = require('chai').assert;

module.exports = [

  {
    name: 'Create Array',
    prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
    answer: `const fruits = ['apple', 'banana'];
             return fruits;`,
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
    answer: `const fruits = ['apple', 'banana'];
             return fruits[0];`,
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
    name: 'Access Array item by index (last)',
    prompt: 'Return the last value of the Array',
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             return fruits[fruits.length - 1];`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, 'orange') === undefined);
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
    answer: `const fruits = ['apple', 'banana'];
             return fruits[1];`,
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
    prompt: 'Loop over the array, add an \'x\' to the end of each name, push each fruit into a new array, then return the new array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             const newFruits = [];
             fruits.forEach(function(item) {
               newFruits.push(item+'x');
             });
             return newFruits;`,
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
  },
  {
    name: 'Add to the end of an Array',
    prompt: `Add 'orange' to the end of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             fruits.push('orange');
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, ['apple', 'banana', 'orange']) === undefined);
        }
      },
      {
        name: 'Must return an Array',
        test: function(output) {
          return (assert.isArray(output) === undefined);
        }
      },
      {
        name: 'Array must have 3 items',
        test: function(output) {
          return (assert.lengthOf(output, 3) === undefined);
        }
      }
    ]
  },
  {
    name: 'Remove from the end of an Array',
    prompt: `Remove 'orange' from the end of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.pop();
             return fruits;`,
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
    name: 'Remove from the front of an Array',
    prompt: `Remove 'apple' from the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.shift();
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, ['banana', 'orange']) === undefined);
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
    name: 'Add to the front of an Array',
    prompt: `Add 'strawberry' to the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.unshift('strawberry');
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, ['strawberry', 'apple', 'banana', 'orange']) === undefined);
        }
      },
      {
        name: 'Must return an Array',
        test: function(output) {
          return (assert.isArray(output) === undefined);
        }
      },
      {
        name: 'Array must have 4 items',
        test: function(output) {
          return (assert.lengthOf(output, 4) === undefined);
        }
      }
    ]
  },
  {
    name: 'Find the index of an item in the Array',
    prompt: `Return the index of 'banana' in the Array.`,
    given: `const fruits = ['strawberry', 'banana', 'mango'];\r`,
    answer: `const fruits = ['strawberry', 'banana', 'mango'];
             const ind = fruits.indexOf('banana');
             return ind;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (assert.deepEqual(output, 1) === undefined);
        }
      },
      {
        name: 'Must return a Number',
        test: function(output) {
          return (assert.isNumber(output) === undefined);
        }
      }
    ]
  }


];

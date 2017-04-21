const assert = require('chai').assert;

module.exports = [
  {
    name: 'Create Array',
    time: 10,
    prompt: "Create and return an array that contains 'apple' and 'banana'",
    answer: `const fruits = ['apple', 'banana'];
             return fruits;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, ['apple', 'banana']) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 2 items',
        test: function(output) {
          return assert.lengthOf(output, 2) === undefined;
        },
      },
    ],
  },
  {
    name: 'Access Array by index (first)',
    time: 10,
    prompt: 'Return the first value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             return fruits[0];`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 'apple') === undefined;
        },
      },
      {
        name: 'Returns a String',
        test: function(output) {
          return assert.isString(output) === undefined;
        },
      },
    ],
  },
  {
    name: 'Access Array by index (last)',
    time: 10,
    prompt: 'Return the last value of the Array',
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             return fruits[fruits.length - 1];`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 'orange') === undefined;
        },
      },
      {
        name: 'Returns a String',
        test: function(output) {
          return assert.isString(output) === undefined;
        },
      },
    ],
  },
  {
    name: 'Access Array by index (second)',
    time: 10,
    prompt: 'Return the second value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             return fruits[1];`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 'banana') === undefined;
        },
      },
      {
        name: 'Returns a String',
        test: function(output) {
          return assert.isString(output) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.forEach()',
    time: 20,
    prompt: "Loop over the array, add an 'x' to the end of each name, push each fruit into a new array, then return the new array.",
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             const newFruits = [];
             fruits.forEach(function(item) {
               newFruits.push(item+'x');
             });
             return newFruits;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, ['applex', 'bananax']) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 2 items',
        test: function(output) {
          return assert.lengthOf(output, 2) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.push()',
    time: 10,
    prompt: `Add 'orange' to the end of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             fruits.push('orange');
             return fruits;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return (
            assert.deepEqual(output, ['apple', 'banana', 'orange']) ===
            undefined
          );
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 3 items',
        test: function(output) {
          return assert.lengthOf(output, 3) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.pop()',
    time: 10,
    prompt: `Remove 'orange' from the end of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.pop();
             return fruits;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, ['apple', 'banana']) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 2 items',
        test: function(output) {
          return assert.lengthOf(output, 2) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.shift()',
    time: 10,
    prompt: `Remove 'apple' from the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.shift();
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return assert.deepEqual(output, ['banana', 'orange']) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 2 items',
        test: function(output) {
          return assert.lengthOf(output, 2) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.unshift()',
    time: 10,
    prompt: `Add 'strawberry' to the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.unshift('strawberry');
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: function(output) {
          return (
            assert.deepEqual(output, [
              'strawberry',
              'apple',
              'banana',
              'orange',
            ]) === undefined
          );
        },
      },
      {
        name: 'Must return an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 4 items',
        test: function(output) {
          return assert.lengthOf(output, 4) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.indexOf()',
    time: 10,
    prompt: `Return the index of 'banana' in the Array.`,
    given: `const fruits = ['strawberry', 'banana', 'mango'];\r`,
    answer: `const fruits = ['strawberry', 'banana', 'mango'];
             const ind = fruits.indexOf('banana');
             return ind;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 1) === undefined;
        },
      },
      {
        name: 'Returns a Number',
        test: function(output) {
          return assert.isNumber(output) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.concat()',
    time: 10,
    prompt: `Merge the two arrays using Array's 'concat()' method. Return the resulting array.`,
    given: `const fruits = ['strawberry', 'banana'];\rconst otherFruits = ['pear','peach'];\r`,
    answer: `const fruits = ['strawberry', 'banana'];
            const otherFruits = ['pear','peach'];
            const allTheFruits = fruits.concat(otherFruits);
            return allTheFruits;\r`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return (
            assert.deepEqual(output, [
              'strawberry',
              'banana',
              'pear',
              'peach',
            ]) === undefined
          );
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 4 items',
        test: function(output) {
          return assert.lengthOf(output, 4) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.join()',
    time: 10,
    prompt: `Mix the two flavors with a '-' using Array's 'join' method. Return the resulting hybrid flavor.`,
    given: `const fruits = ['strawberry', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'banana'];
             const hybrid = fruits.join('-');
             return hybrid;\r`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 'strawberry-banana') === undefined;
        },
      },
      {
        name: 'Returns a String',
        test: function(output) {
          return assert.isString(output) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.slice()',
    time: 20,
    prompt: `Return just the citrus fruits from the 'fruits' array using 'Array.slice()'`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const citrus = fruits.slice(1, 3);
             return citrus;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, ['orange', 'lemon']) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 2 items',
        test: function(output) {
          return assert.lengthOf(output, 2) === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.reverse()',
    time: 10,
    prompt: `Reverse the order of the 'fruit' array using 'Array.reverse()'`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const stiurf = fruits.reverse();
             return stiurf;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return (
            assert.deepEqual(output, [
              'banana',
              'lemon',
              'orange',
              'strawberry',
            ]) === undefined
          );
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 4 items',
        test: function(output) {
          return assert.lengthOf(output, 4) === undefined;
        },
      },
      {
        name: `First item is 'banana'`,
        test: function(output) {
          return assert.deepEqual(output[0], 'banana') === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.sort()',
    time: 10,
    prompt: `Sort the order of the 'fruit' array using 'Array.sort()'`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const orderlyFruit = fruits.sort();
             return orderlyFruit;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return (
            assert.deepEqual(output, [
              'banana',
              'lemon',
              'orange',
              'strawberry',
            ]) === undefined
          );
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 4 items',
        test: function(output) {
          return assert.lengthOf(output, 4) === undefined;
        },
      },
      {
        name: `First item is 'banana'`,
        test: function(output) {
          return assert.deepEqual(output[0], 'banana') === undefined;
        },
      },
    ],
  },
  {
    name: 'Array.lastIndexOf()',
    time: 10,
    prompt: `Return the index of the last 'peach' instance in the 'fruit' array using 'Array.lastIndexOf()'`,
    given: `const fruits = ['peach', 'orange', 'lemon', 'peach'];\r`,
    answer: `const fruits = ['peach', 'orange', 'lemon', 'peach'];
             const wheresTheLastPeach = fruits.lastIndexOf('peach');
             return wheresTheLastPeach;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, 3) === undefined;
        },
      },
      {
        name: 'Returns a Number',
        test: function(output) {
          return assert.isNumber(output) === undefined;
        },
      },
    ],
  },
  // forEach? fix one above that tried, but can't verify forEach was used
  // .map
  // filter
  {
    name: 'Array.filter()',
    time: 10,
    prompt: `return an array of the numbers greater than 5 in 'fruits' using 'Array.filter()'`,
    given: `const numbers = [1, 1, 2, 3, 5, 8, 13, 21];\r`,
    answer: `const numbers = [1, 1, 2, 3, 5, 8, 13, 21];
             const overFive = numbers.filter(num => num > 5);
             return overFive;`,
    tests: [
      {
        name: 'Correct output',
        test: function(output) {
          return assert.deepEqual(output, [8, 13, 21]) === undefined;
        },
      },
      {
        name: 'Returns an Array',
        test: function(output) {
          return assert.isArray(output) === undefined;
        },
      },
      {
        name: 'Array has 3 items',
        test: function(output) {
          return assert.lengthOf(output, 3) === undefined;
        },
      },
      {
        name: `First item is 8`,
        test: function(output) {
          return assert.deepEqual(output[0], 8) === undefined;
        },
      },
    ],
  },
  // every
  // some
  // reduce
  // reduceRight
  // Array.from and other ways to turn array-like into array
];

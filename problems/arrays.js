module.exports = {
  
  problems: [

    {
      name: 'create-array',
      prompt: 'Create an array named \'fruits\' that contains \'Apple\' and \'Banana\'',
      answer: `const fruits = ['Apple', 'Banana'];`,
      correctOutput: `['Apple', 'Banana']`,
      tests: [
        {
          name: 'Output must be correct',
          test: `assert.deepEqual(output, correctOutput) === undefined`
        },
        {
          name: 'Must use var, let, or const',
          test: `importants[0].type === 'Identifier'`,
        },
        {
          name: 'Must use an Array',
          test: `parsed.body[0].declarations[0].init.type === 'ArrayExpression'`,
        },
        {
          name: '',
          test: `parsed.body[0].declarations[0].init.elements.length === 2`,
        },
        {
          name: '',
          test: `parsed.body[0].declarations[0].init.elements[0].value === 'Apple'`,
        },
        {
          name: '',
          test: `parsed.body[0].declarations[0].init.elements[1].value === 'Banana'`
        }
      ]
    }

  ]

}
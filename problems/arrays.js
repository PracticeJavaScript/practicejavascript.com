module.exports = {
  
  problems: [

    {
      name: 'create-array',
      prompt: 'Create an array named \'fruits\' that contains \'Apple\' and \'Banana\'',
      answer: `const fruits = ['Apple', 'Banana'];`,
      correctOutput: `['Apple', 'Banana']`,
      tests: [
        `assert.deepEqual(output, correctOutput) === undefined`
        `importants[0].type === 'Identifier'`,

      ]
    }

  ]

}
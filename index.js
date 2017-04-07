console.log('index.js!');

// DEPENDENCIES
// ============================================================

const safeEval = require('notevil');
// const babylon = require('babylon');
// const babel = require('babel-core');
const esprima = require('esprima');
// const evaluate = require('static-eval');
const assert = require('chai').assert;

// PROBLEMS
// ============================================================
const problems = require('./problems/arrays.js');

// CONFIG
// ============================================================


// UI
// ============================================================

// elements
const code = document.getElementById('code');
const test = document.getElementById('test');
// const fruits = ['Apple', 'Banana'];

function updateTest(pass) {
  // console.log('pass:', pass);
  if (pass === true) {
    test.innerText = 'PASS';
    test.classList.remove('fail');
    test.classList.add('pass');
  } else {
    test.innerText = 'FAIL';
    test.classList.remove('pass');
    test.classList.add('fail');
  }
}



// VERIFICATION LOGIC
// ============================================================

function getOutput(code) {
  let evald = false;
  try {
    evald = safeEval(`(function(){${code}})()`);
  } catch (error) {
    console.log('safeEval error:', error);
  }
  return evald;
}

function getParsed(input) {
  let parsed = false;
  const options = {
    tokens: true,
    tolerant: true
  };
  try {
    parsed = esprima.parse(input, options);
  } catch (error) {
    console.log('getParsed error:', error);
  }
  return parsed;
}

function getTested(parsed, output) {
  const correctAnswer = ['apple', 'banana'];
  let tested = false;
  try {
    // output is correct
    let test0 = false;
    try {
      test0 = (assert.deepEqual(output, correctAnswer) === undefined);
    } catch (error) {
      // console.log('error:', error);
    }
    // // has a var-thing
    // const test1 = parsed.body[0].declarations[0].type === 'Identifier';
    // // var-thing is called 'fruits'
    // const test2 = parsed.body[0].declarations[0].name === 'fruits';
    // // fruits is an array
    // const test3 = parsed.body[0].declarations[0].init.type === 'ArrayExpression';
    // // array has only 2 values
    // const test4 = parsed.body[0].declarations[0].init.elements.length === 2;
    // // array has values 'Apple' and 'Banana'
    // const test5 = parsed.body[0].declarations[0].init.elements[0].value === 'Apple';
    // const test6 = parsed.body[0].declarations[0].init.elements[1].value === 'Banana';
    tested = !!(test0 === true
              // && test1 === true 
              // && test2 === true
              // && test3 === true
              // && test4 === true
              // && test5 === true
              // && test6 === true
              )
  } catch (error) {
    console.log('error:', error);
  }
  return tested;
}

function testSuite(e) {
  // console.log('code.value:', code.value);
  console.log(typeof code.value);

  // run stuff
  // generate an AST
  const parsed = getParsed(code.value);
  // evaluate JS to an output
  const output = getOutput(code.value);
  // run tests on code
  const tested = getTested(parsed, output);

  // update UI with results
  updateTest(tested);
}

code.addEventListener('keyup', testSuite);

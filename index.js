console.log('index.js!');

// DEPENDENCIES
// ============================================================

const safeEval = require('notevil');
const esprima = require('esprima');
const assert = require('chai').assert;


// PROBLEMS
// ============================================================
const problems = require('./problems/arrays.js');
// console.log('problems:', problems);


// CONFIG
// ============================================================


// UI
// ============================================================

// elements
const problemNameEl = document.getElementById('problem-name');
const problemEl = document.getElementById('problem');
const codeEl = document.getElementById('code');
const testAreaEl = document.getElementById('test-area');
const testSuiteEl = document.getElementById('test-suite');

function getRandomProblem(problemsArr) {
  return problemsArr[Math.floor(Math.random()*problemsArr.length)]
}

function loadProblem(problemObj) {
  console.table(problemObj);
  // prob name
  problemNameEl.innerText = problemObj.name;
  // prob question
  problemEl.innerText = problemObj.prompt;
  // prob given
  if (problemObj.given) {
    codeEl.value = problemObj.given;
  }
  // seed / update tests
  updateTests(problemObj.tests);
}

// TODO: show tests and current pass state of them
// test array and test dom array will be matched in order,
// so we don't need to rebuild dom each time the tests change
function updateTests(tests, testStatus) {
  console.log('tests:', tests);
  console.log('testStatus:', testStatus);
  buildTests(tests);
  updateTestStatus();
  // if (pass === true) {
  //   test.innerText = 'PASS';
  //   test.classList.remove('fail');
  //   test.classList.add('pass');
  // } else {
  //   test.innerText = 'FAIL';
  //   test.classList.remove('pass');
  //   test.classList.add('fail');
  // }
}

function buildTests(tests) {
  if (tests) {
    const testsDom = tests.map(test => {
      // console.log('test.name',test.name);
      return `<div class="test monospace">
                <div class="test-state">[x]</div>
                <div class="test-name">${test.name}</div>
              </div>`;
    }).join('');
    console.log('testsDom', testsDom);
    testSuiteEl.innerHTML = testsDom;
  }
}

function updateTestStatus(tests, testStatus) {

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

function getTested(output) {
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
  // console.log('codeEl.value:', codeEl.value);
  console.log(typeof codeEl.value);

  // run stuff
  const output = getOutput(codeEl.value);
  // run tests on code, return object/array of test results
  const tested = getTested(output);

  // update UI with results
  updateTests(tested);
}

codeEl.addEventListener('keyup', testSuite);



loadProblem(getRandomProblem(problems))

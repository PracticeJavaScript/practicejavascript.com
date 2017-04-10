(function(){

  // DEPENDENCIES
  // ============================================================

  // notevil doesn't support ES6 arrows, probably other parts of syntax :(
  const safeEval = require('notevil');
  // const safeEval = require('static-eval');              // required AST to work?
  // const safeEval = require('ecmascript-evaluator').run; // 6MB, limited on inputs
  // const safeEval = require('@nx-js/compiler-util').compileCode; // no idea?
  const assert = require('chai').assert;


  // PROBLEMS
  // ============================================================
  const problems = require('../problems/arrays.js');


  // CONFIG
  // ============================================================
  // Hoist current problem
  let currentProblem;

  // UI
  // ============================================================

  // elements
  const problemNameEl = document.getElementById('problem-name');
  const problemEl = document.getElementById('problem');
  const codeEl = document.getElementById('code');
  const testAreaEl = document.getElementById('test-area');
  const testSuiteEl = document.getElementById('test-suite');
  const testTotalEl = document.getElementById('test-total');
  const consoleEl = document.getElementById('console');

  function getRandomProblem(problemsArr) {
    return problemsArr[Math.floor(Math.random()*problemsArr.length)]
  }

  function loadProblem(problemObj) {
    currentProblem = problemObj;
    // prob name
    problemNameEl.innerText = problemObj.name;
    // prob question
    problemEl.innerText = problemObj.prompt;
    // prob given
    if (problemObj.given) {
      codeEl.value = problemObj.given;
    }
    // seed tests, pass (init = true) as second param
    testSuite(null, true);
  }

  // TODO: show tests and current pass state of them
  // test array and test dom array will be matched in order,
  // so we don't need to rebuild dom each time the tests change
  function updateTests(testStatus, init) {
    if(init === true) {
      buildTests(currentProblem.tests);
    }
    updateTestStatus(testStatus);
  }

  function buildTests(tests) {
    if (tests) {
      const testsDom = tests.map(test => {
        return `<div class="test monospace">
                  <div class="test-state">[&#x2718;]</div>
                  <div class="test-name">${test.name}</div>
                </div>`;
      }).join('');
      testSuiteEl.innerHTML = testsDom;
    }
  }

  function updateTestStatus(testStatuses) {
    if (!testStatuses) {
      throw new Error('No testStatuses provided.');
    }
    // Find out if all tests have passed or not
    let allPassed = true;
    testStatuses.forEach(testPassed => {
      if (testPassed !== true) {
        allPassed = false;
      }
    });
    const testEls = Array.from(testSuiteEl.querySelectorAll('.test-state'));
    testEls.forEach((testStatusEl, iter) => {
      if (testStatuses[iter] === true) {
        testStatusEl.innerHTML = '[&#x2713;]';
        testStatusEl.classList.remove('fail');
        testStatusEl.classList.add('pass');
      } else {
        testStatusEl.innerHTML = '[&#x2718;]';
        testStatusEl.classList.remove('pass');
        testStatusEl.classList.add('fail');
      }
    });

    if (allPassed === true) {
      testTotalEl.innerText = 'PASS';
      testTotalEl.classList.remove('fail');
      testTotalEl.classList.add('pass');
    } else {
      testTotalEl.innerText = 'FAIL';
      testTotalEl.classList.remove('pass');
      testTotalEl.classList.add('fail');
    }
  }

  function printAssertError(errObj) {
    // make element
    const el = document.createElement('div');
    el.classList.add('assert-error');
    const inner = `
      Expected: ${JSON.stringify(errObj.expected)}
      Actual: ${JSON.stringify(errObj.actual)}
    `;
    el.innerHTML = inner;
    // prepend element
    consoleEl.insertBefore(el, consoleEl.firstChild)
  }

  function printEvalError(errObj) {
    // // make element
    const el = document.createElement('div');
    el.classList.add('assert-error');
    const inner = `
      Syntax Error: ${JSON.stringify(errObj.message)}
    `;
    el.innerHTML = inner;
    // prepend element
    consoleEl.insertBefore(el, consoleEl.firstChild)
  }




  // VERIFICATION LOGIC
  // ============================================================

  function testSuite(e, init) {
    // console.log('codeEl.value:', codeEl.value);
    // console.log(typeof codeEl.value);
    // run stuff
    const output = getOutput(codeEl.value);
    // console.log('output:', output);
    // run tests on code, return object/array of test results
    const tested = runTests(output);
    // update UI with results
    updateTests(tested, init);
  }

  function getOutput(code) {
    let evald = false;
    try {
      evald = safeEval(`(function(){${code}})()`);
    } catch (error) {
      // console.log('safeEval error:', error);
      printEvalError(error);
    }
    return evald;
  }

  function runTests(output) {
    let tested = false;
    tested = currentProblem.tests.map(test => {
      let testOutcome = false;
      try {
        if (!output) {
          testOutcome = false;
        } else if (test.type === 'assertCorrectOutput') {
          // output is correct
          testOutcome = test.test(output, test.correctOutput);
        } else {
          // other tests that don't need args passed
          testOutcome = test.test();
        }
        return testOutcome;
      } catch (error) {
        // console.log('error:', error);
        printAssertError(error);
      }
    });
    return tested;
  }



  // bind it up
  codeEl.addEventListener('keyup', testSuite);

  // start it up
  window.addEventListener('load', () => {
    // load random problem
    loadProblem(getRandomProblem(problems));
    // initalized test suite with starting failures
    testSuite(null, true);
  });

})();

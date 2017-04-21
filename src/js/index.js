(function() {
  // DEPENDENCIES
  // ============================================================

  const assert = require('chai').assert;
  const localforage = require('localforage');

  // PROBLEMS
  // ============================================================

  let problems = require('../problems/arrays.js');

  // CONFIG
  // ============================================================

  // Hoist current problem
  let currentProblem;
  // keys to ignore while user is navigating around the textarea but not changing any code
  const ignoreKeyCodes = [
    9, // tab
    37, // left arrow
    39, // right arrow
    38, // up arrow
    40, // down arrow
  ];

  let config = {
    shuffle: true,
    timer: false,
    currentIndex: 0,
  };

  // pull config from localforage
  localforage
    .getItem('js_practice_config')
    .then(val => {
      console.log('localforage val:', val);
      if (val) {
        config = val;
      }
      loadApp(config);
    })
    .catch(err => {
      console.log('localforage err:', err);
      loadApp(config);
    });

  function updateLocalstore(config) {
    return localforage
      .setItem('js_practice_config', config)
      .then(val => {
        console.log('Settings updated:', val);
      })
      .catch(err => {
        console.log('Settings update error:', err);
      });
  }

  // UI
  // ============================================================

  // elements
  const problemNameEl = document.getElementById('problem-name');
  const problemEl = document.getElementById('problem');
  const codeEl = document.getElementById('code');
  const testAreaEl = document.getElementById('test-area');
  const testSuiteEl = document.getElementById('test-suite');
  const testTotalEl = document.getElementById('test-total');
  const evalConsoleEl = document.getElementById('eval-output');
  const assertConsoleEl = document.getElementById('assert-output');
  const shuffleProblemsButtonEl = document.getElementById('shuffle-problems');
  const previousProblemButtonEl = document.getElementById('prev-problem');
  const nextProblemButtonEl = document.getElementById('next-problem');

  // get indexes
  function getRandomIndex(problemsArr) {
    const ind = Math.floor(Math.random() * problemsArr.length);
    config.currentIndex = ind;
    updateLocalstore(config);
    return ind;
  }

  function getPreviousIndex(problemsArr) {
    let probInd;
    const currentIndex = config.currentIndex;
    // if at beginning, go to end
    if (currentIndex === 0) {
      probInd = problemsArr.length - 1;
    } else {
      probInd = currentIndex - 1;
    }
    return probInd;
  }

  function getNextIndex(problemsArr) {
    let probInd;
    const currentIndex = config.currentIndex;
    // if at end or invalid, restart series
    if (currentIndex >= problemsArr.length - 1 || currentIndex < 0) {
      probInd = 0;
    } else {
      probInd = currentIndex + 1;
    }
    return probInd;
  }

  // get problems
  function getCurrentProblem(problemsArr) {
    return problemsArr[config.currentIndex];
  }

  function previousProblem(e) {
    console.log('previousProblem!');
    config.currentIndex = config.shuffle
      ? getRandomIndex(problems)
      : getPreviousIndex(problems);
    updateLocalstore(config).then(_ => {
      window.location.reload();
    });
  }

  function nextProblem(e) {
    console.log('nextProblem!');
    config.currentIndex = config.shuffle
      ? getRandomIndex(problems)
      : getNextIndex(problems);
    updateLocalstore(config).then(_ => {
      window.location.reload();
    });
  }

  function toggleShuffle(e) {
    console.log('toggle shuffle!');
    config.shuffle = config.shuffle === true ? false : true;
    shuffleProblemsButtonEl.classList.toggle('active');
    updateLocalstore(config);
  }

  function loadProblem(problemObj) {
    currentProblem = problemObj;
    // prob question
    problemEl.innerText = problemObj.prompt;
    // prob given
    if (problemObj.given) {
      codeEl.value = problemObj.given;
    }
    // seed tests, pass (init = true) as second param
    testSuite(null, true);
  }

  function updateTests(testStatus, init) {
    if (init === true) {
      buildTests(currentProblem.tests);
    }
    updateTestStatus(testStatus);
  }

  function buildTests(tests) {
    if (tests) {
      const testsDom = tests
        .map(test => {
          return `<div class="test monospace">
                  <div class="test-state">[&#x2718;]</div>
                  <div class="test-name">${test.name}</div>
                </div>`;
        })
        .join('');
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
    // make element string
    let inner = '';
    if (errObj !== null) {
      inner = `
      <div class="assert-error">
        Expected: ${JSON.stringify(errObj.expected)}
        Actual: ${JSON.stringify(errObj.actual)}
      </div>`;
    }

    // prepend element
    assertConsoleEl.innerHTML = inner;
  }

  function printEvalOutput(errObj, output) {
    // make element string
    let inner = '';
    if (errObj && errObj.message !== undefined) {
      inner = `
      <div class="assert-error">
        Syntax Error: ${JSON.stringify(errObj.message)}
      </div>`;
    } else if (output) {
      inner = `
      <div class="assert-error">
        Output: ${JSON.stringify(output)}
      </div>`;
    }
    // prepend element
    evalConsoleEl.innerHTML = inner;
  }

  // VERIFICATION LOGIC
  // ============================================================

  function testSuite(init) {
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
      evald = eval(`(function(){${code}})()`);
      printEvalOutput(null, evald); // print current output
    } catch (error) {
      // console.log('eval error:', error);
      printEvalOutput(error);
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
        } else {
          testOutcome = test.test(output);
        }
        printAssertError(null);
        return testOutcome;
      } catch (error) {
        // console.log('error:', error);
        printAssertError(error);
      }
    });
    return tested;
  }

  // wrapped to prevent race with local config retrieval
  function loadApp(config) {
    console.log('loading app!');

    // show current toggle state
    if (config.shuffle === true) {
      shuffleProblemsButtonEl.classList.add('active');
    }

    // bind it up
    codeEl.addEventListener('keyup', function(e) {
      // if not arrow keys or other non-character keys
      if (ignoreKeyCodes.indexOf(e.keyCode) === -1) {
        // run test suite
        testSuite();
      }
    });
    shuffleProblemsButtonEl.addEventListener('click', toggleShuffle);
    previousProblemButtonEl.addEventListener('click', previousProblem);
    nextProblemButtonEl.addEventListener('click', nextProblem);

    // start it up!
    // load current problem
    const currProb = getCurrentProblem(problems);
    loadProblem(currProb);
    // initalized test suite with starting failures
    testSuite(true);
  } // loadApp()
})();

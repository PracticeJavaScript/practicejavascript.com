// DEPENDENCIES
// ============================================================
// import localforage from 'localforage';

// PROBLEMS
// ============================================================
// import * as arrays from '../problems/arrays';
const arrays = require('../problems/arrays');

(function () {
  const problems = [];
  problems.push(...arrays.default);

  // CONFIG
  // ============================================================

  // Hoist current problem
  let currentProblem;

  // Keys to ignore while user is navigating around the textarea but not changing any code
  const ignoreKeyCodes = [
    9, // Tab
    37, // Left arrow
    39, // Right arrow
    38, // Up arrow
    40 // Down arrow
  ];

  let config = {
    shuffle: true,
    timer: false,
    currentIndex: 0
  };

  // Pull config from localforage
  const localConfig = localStorage.getItem('js_practice_config');

  // If it's cool, use it
  if (localConfig) {
    config = JSON.parse(localConfig);
  } else {
    console.log('error getting previous or no config');
  }
  loadApp(config);

  // localforage
  //   .getItem('js_practice_config')
  //   .then(val => {
  //     if (val) {
  //       config = val;
  //     }
  //     loadApp(config);
  //   })
  //   .catch(err => {
  //     console.log('localforage err:', err);
  //     loadApp(config);
  //   });

  function updateLocalstore(config) {
    // return localforage
    //   .setItem('js_practice_config', config)
    //   .then(val => val)
    //   .catch(err => {
    //     console.log('Settings update error:', err);
    //   });
    return new Promise((resolve, reject) => {
      resolve(localStorage.setItem('js_practice_config', JSON.stringify(config)));
    });
  }

  // HELPERS
  // ============================================================

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  // UI
  // ============================================================

  // elements
  // const document.getElementById('problem') = document.getElementById('problem');
  // const document.getElementById('code') = document.getElementById('code');
  // const document.getElementById('test-suite') = document.getElementById('test-suite');
  // const document.getElementById('test-total') = document.getElementById('test-total');
  // const document.getElementById('eval-output') = document.getElementById('eval-output');
  // const document.getElementById('assert-output') = document.getElementById('assert-output');
  // const document.getElementById('shuffle-problems') = document.getElementById('shuffle-problems');
  // const document.getElementById('prev-problem') = document.getElementById('prev-problem');
  // const document.getElementById('next-problem') = document.getElementById('next-problem');

  // Get indexes
  function getRandomIndex(problemsArr) {
    const ind = Math.floor(Math.random() * problemsArr.length);
    config.currentIndex = ind;
    updateLocalstore(config);
    return ind;
  }

  function getPreviousIndex(problemsArr) {
    let probInd;
    const currentIndex = config.currentIndex;
    // If at beginning, go to end
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
    // If at end or invalid, restart series
    if (currentIndex >= problemsArr.length - 1 || currentIndex < 0) {
      probInd = 0;
    } else {
      probInd = currentIndex + 1;
    }
    return probInd;
  }

  // Get problems
  function getCurrentProblem(problemsArr) {
    return problemsArr[config.currentIndex];
  }

  function previousProblem() {
    console.log('previousProblem!');
    // Activate back button, for visual queue of nav feedback
    document.getElementById('prev-problem').classList.add('active');
    config.currentIndex = config.shuffle
      ? getRandomIndex(problems)
      : getPreviousIndex(problems);
    updateLocalstore(config).then(() => {
      window.location.reload();
    });
  }

  function nextProblem() {
    console.log('nextProblem!');
    // Activate next button, for visual queue of nav feedback
    document.getElementById('next-problem').classList.add('active');
    config.currentIndex = config.shuffle
      ? getRandomIndex(problems)
      : getNextIndex(problems);
    updateLocalstore(config).then(() => {
      window.location.reload();
    });
  }

  function toggleShuffle() {
    console.log('toggle shuffle!');
    config.shuffle = !config.shuffle; // Flip it
    document.getElementById('shuffle-problems').classList.toggle('active');
    document.getElementById('prev-problem').parentNode.classList.toggle('hidden');
    updateLocalstore(config);
  }

  function loadProblem(problemObj) {
    currentProblem = problemObj;
    // Prob question
    document.getElementById('problem').innerText = problemObj.prompt;
    // Prob given code
    if (problemObj.given) {
      document.getElementById('code').value = problemObj.given;
    }
    // Seed the tests, pass (init = true) as second param
    testSuite(null, true);
  }

  // TODO: Build the assert errors into the test dom on each update.
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
      document.getElementById('test-suite').innerHTML = testsDom;
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
    const testState = document.getElementById('test-suite');
    const testEls = [].slice.call(testState.querySelectorAll('.test-state'));
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
      document.getElementById('test-total').innerText = 'PASS';
      document.getElementById('test-total').classList.remove('fail');
      document.getElementById('test-total').classList.add('pass');
    } else {
      document.getElementById('test-total').innerText = 'FAIL';
      document.getElementById('test-total').classList.remove('pass');
      document.getElementById('test-total').classList.add('fail');
    }
  }

  function printAssertError(errObj) {
    // Make element string
    let inner = '';
    if (errObj !== null) {
      inner = `
      <div class="assert-error">
        Expected: ${JSON.stringify(errObj.expected)}
        Actual: ${JSON.stringify(errObj.actual)}
      </div>`;
    }

    // Prepend element
    document.getElementById('assert-output').innerHTML = inner;
  }

  function printEvalOutput(errObj, output) {
    // Make element string
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
    // Prepend element
    document.getElementById('eval-output').innerHTML = inner;
  }

  // VERIFICATION LOGIC
  // ============================================================

  function testSuite(init) {
    // Show 'working' indicator
    document.getElementById('test-total').classList.toggle('working');
    // Run stuff
    const output = getOutput(document.getElementById('code').value);
    // Run tests on code, return object/array of test results
    const tested = runTests(output);
    // Hide 'working' indicator
    document.getElementById('test-total').classList.toggle('working');
    // Update UI with results
    updateTests(tested, init);
  }

  function getOutput(code) {
    let evald = false;
    try {
      evald = eval(`(function(){${code}})()`); // eslint-disable-line no-eval
      printEvalOutput(null, evald); // Print current output
    } catch (err) {
      printEvalOutput(err);
    }
    return evald;
  }

  function runTests(output) {
    let tested = false;
    tested = currentProblem.tests.map(test => {
      let testOutcome = false;
      try {
        if (output) {
          testOutcome = test.test(output);
        }
        printAssertError(null);
      } catch (err) {
        printAssertError(err);
      }
      return testOutcome;
    });
    return tested;
  }

  // Wrapped to prevent race with local config retrieval
  function loadApp(config) {
    console.log('loading app!');

    // Show current toggle state
    if (config.shuffle === true) {
      document.getElementById('shuffle-problems').classList.add('active');
      document.getElementById('prev-problem').parentNode.classList.add('hidden');
    }

    // Keybinding stuff
    // ============================================================

    // Debounced code validation
    const debouncedInputValidation = debounce(e => {
      // If not arrow keys or other non-character keys
      if (ignoreKeyCodes.indexOf(e.keyCode) === -1) {
        // Run test suite
        testSuite();
      }
    }, 200);

    function problemNav(e) {
      // Go to previous problem keybinding
      // If CMD/CTRL + SHIFT + RETURN/ENTER
      if (config.shuffle === false && e.keyCode === 13 && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        // Go to next problem
        previousProblem();
      } else if (e.keyCode === 13 && !e.shiftKey && (e.metaKey || e.ctrlKey)) {
      // Go to next problem keybinding
      // If CMD/CTRL + RETURN/ENTER
        // Go to next problem
        nextProblem();
      }
    }

    // Event Bindings
    // ============================================================

    // Bind it up
    document.getElementById('code').addEventListener('keydown', debouncedInputValidation);
    document.addEventListener('keydown', problemNav);
    document.getElementById('shuffle-problems').addEventListener('click', toggleShuffle);
    document.getElementById('prev-problem').addEventListener('click', previousProblem);
    document.getElementById('next-problem').addEventListener('click', nextProblem);

    // Start it up!
    // Load current problem
    const currProb = getCurrentProblem(problems);
    loadProblem(currProb);
    // Initalized test suite with starting failures
    testSuite(true);
  }
})();

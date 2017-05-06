(function (document, window) {
  // DEPENDENCIES
  // ============================================================
  const localforage = require('localforage');

  // PROBLEMS
  // ============================================================
  const problems = require('../problems/arrays.js');

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
  localforage
    .getItem('js_practice_config')
    .then(val => {
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
      .then(val => val)
      .catch(err => {
        console.log('Settings update error:', err);
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
  const problemEl = document.getElementById('problem');
  const codeEl = document.getElementById('code');
  const testSuiteEl = document.getElementById('test-suite');
  const testTotalEl = document.getElementById('test-total');
  const evalConsoleEl = document.getElementById('eval-output');
  const assertConsoleEl = document.getElementById('assert-output');
  const shuffleProblemsButtonEl = document.getElementById('shuffle-problems');
  const previousProblemButtonEl = document.getElementById('prev-problem');
  const nextProblemButtonEl = document.getElementById('next-problem');

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
    previousProblemButtonEl.classList.add('active');
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
    nextProblemButtonEl.classList.add('active');
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
    shuffleProblemsButtonEl.classList.toggle('active');
    previousProblemButtonEl.parentNode.classList.toggle('hidden');
    updateLocalstore(config);
  }

  function loadProblem(problemObj) {
    currentProblem = problemObj;
    // Prob question
    problemEl.innerText = problemObj.prompt;
    // Prob given code
    if (problemObj.given) {
      codeEl.value = problemObj.given;
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
    const testEls = [].slice.call(testSuiteEl.querySelectorAll('.test-state'));
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
    assertConsoleEl.innerHTML = inner;
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
    evalConsoleEl.innerHTML = inner;
  }

  // VERIFICATION LOGIC
  // ============================================================

  function testSuite(init) {
    // Show 'working' indicator
    testTotalEl.classList.toggle('working');
    // Run stuff
    const output = getOutput(codeEl.value);
    // Run tests on code, return object/array of test results
    const tested = runTests(output);
    // Hide 'working' indicator
    testTotalEl.classList.toggle('working');
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
      shuffleProblemsButtonEl.classList.add('active');
      previousProblemButtonEl.parentNode.classList.add('hidden');
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
    codeEl.addEventListener('keydown', debouncedInputValidation);
    document.addEventListener('keydown', problemNav);
    shuffleProblemsButtonEl.addEventListener('click', toggleShuffle);
    previousProblemButtonEl.addEventListener('click', previousProblem);
    nextProblemButtonEl.addEventListener('click', nextProblem);

    // Start it up!
    // Load current problem
    const currProb = getCurrentProblem(problems);
    loadProblem(currProb);
    // Initalized test suite with starting failures
    testSuite(true);
  }
})(document, window);

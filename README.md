# Practice JavaScript using game stuffs

[ ![Codeship Status for PracticeJavaScript/practicejavascript.com](https://app.codeship.com/projects/091c0e50-0a7c-0135-8b3c-6ed4d7e33e57/status?branch=master)](https://app.codeship.com/projects/214753)
[![Build Status](https://travis-ci.org/PracticeJavaScript/practicejavascript.com.svg?branch=master)](https://travis-ci.org/PracticeJavaScript/practicejavascript.com)

- Should be rote, easy problems, to exercise mastery, rather than solving brain puzzles like other sites
- Should be solvable in under 30 seconds each


## How To Install Locally
```bash
npm i -g yarn # if you don't have yarn yet
git clone https://github.com/PracticeJavaScript/practicejavascript.com.git
cd practicejavascript.com
yarn install
yarn run watch
# Another tab
firebase serve
```

- That will build it all and watch the css, img, and js assets.
- Then you can load up `http://localhost:5000` in a browser. narf!
`/src/index.js` is the main file you'll want to edit for functionality.

## How To Add New Problems
- Problems are at `/src/problems/*.js`
- Only the asset problems are loaded for now, though we will change the problems mechanism soon to take a join of all files in it's array

Each problem must have:

- name (Not currently displayed in UI, but how we refer to unique problem)
- time (Time problem expected to solve. May be used for a timer in future.)
- prompt (UI prompt that should give user all info to solve problem. Be consise.)
- given (Given code to start problem)
- answer (Will be used to 'peek' at solved code in future UI)
- tests (Array of tests code eval will be run against)

Each test must have:

- name (appears in test list UI)
- test (assertions. returns boolean)

This test function will be run on code submission, and MUST return boolean. `output` param is available.
`output` is the output of the JavaScript evaluation of the user's code submission.
This test function may make chai.js assertions or any other comparison against the `output` value.

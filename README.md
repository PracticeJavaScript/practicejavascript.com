# Practice JavaScript using this fun game

[ ![Codeship Status for PracticeJavaScript/practicejavascript.com](https://app.codeship.com/projects/091c0e50-0a7c-0135-8b3c-6ed4d7e33e57/status?branch=master)](https://app.codeship.com/projects/214753)
[![Build Status](https://travis-ci.org/PracticeJavaScript/practicejavascript.com.svg?branch=master)](https://travis-ci.org/PracticeJavaScript/practicejavascript.com)

![ScreenShot of practicejavascript.com](https://cldup.com/cFITECDXpD.png)

## Principles
- Fast, easy to start. No delays.
- Keep it simple. As few visual elements as possible.
- Never leave the keyboard.
- Fast and rewarding feedback loop like a mobile game. Obey ["Doherty Threshold"](http://daverupert.com/2015/06/doherty-threshold/)


- True katas should be rote, easy problems, solved a variety of ways, to exercise mastery, rather than solving longer brain puzzles like other sites
- Should be solvable in under 30 seconds each


## How To Install Locally
```bash
npm i -g yarn # if you don't have yarn yet
yarn global add firebase-tools # if you don't have firebase-tools yet
git clone https://github.com/PracticeJavaScript/practicejavascript.com.git
cd practicejavascript.com
yarn install
yarn run watch
# Another tab
firebase serve
```

- That will build it all and watch the css, img, and js assets.
- Then you can load up `http://localhost:5000` or `public/index.html` in a browser. narf!
`/src/index.js`, `/src/css/style.scss`, and `/src/html/index.html` are the main files you'll want to edit for functionality.
- If you have the [LiveReload Chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) installed, it should do live css updates in your browser while gulp watch is running
- CSS is auto-prefixed for the supported browserslist, so don't manually add any browser prefixes to CSS src.
- NOTE: If you change the UI, please update the screenshot at top of this README

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

## Browser support
- See `browserslist` settings in package.json

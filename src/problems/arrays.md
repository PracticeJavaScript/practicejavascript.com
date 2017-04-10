// 1 - Create an Array
// Create an array named 'fruits' that contains 'Apple' and 'Banana'
const fruits = ['Apple', 'Banana'];
// fruits === ['Apple', 'Banana'];


// 2 - Access an Array item by index (first)
// Given:
const fruits = ['Apple', 'Banana'];
// Get the first value of the array
const first = fruits[0];
// first === 'Apple'


// 3 - Access an Array item by index (second)
// Given:
const fruits = ['Apple', 'Banana'];
// Get the first value of the array
const second = fruits[1];
// second === 'Banana'

// 4 - Access an Array item by index (last)
// Given:
const fruits = ['Apple', 'Banana'];
// Get the first value of the array
const last = fruits[fruits.length - 1];
// last === 'Banana'

// 5 - Loop over Array
// Given:
const fruits = ['Apple', 'Banana'];
// Loop over array, and `console.log()` out the name of each fruit
fruits.forEach(item => console.log(item));
// Apple
// Banana

// 6 - Add to the end of an Array
// Given:
const fruits = ['Apple', 'Banana'];
// Add 'Orange' to the end of the 'fruits' array
fruits.push('Orange');
// fruits === ["Apple", "Banana", "Orange"]

// 7 - Remove from the end of an Array
// Given:
const fruits = ['Apple', 'Banana', 'Orange'];
// Remove 'Orange' from the end of the Array
fruits.pop();
// fruits === ["Apple", "Banana"]

// 8 - Remove from the front of an Array
// Given:
const fruits = ['Apple', 'Banana'];
// Remove 'Apple' from the front of the Array
fruits.shift();
// fruits === ['Banana']

// 9 - Add to the front of an Array
// Given:
const fruits = ['Banana'];
// Add 'Strawberry' to the front of the Array
fruits.unshift('Strawberry');
// fruits === ["Strawberry", "Banana"]

// 10 - Find the index of an item in the Array
// Given:
const fruits = ['Strawberry', 'Banana', 'Mango'];
// Find the index of 'Banana' in the Array
const ind = fruits.indexOf('Banana');
// ind === 1


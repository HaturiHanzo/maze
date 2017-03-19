'use strict';

const alg = require('./algorithm');

let testArray = [
    ['\\', '/', '/', '\\', '\\', '/'],
    ['/', '/', '/', '/', '\\', '/'],
    ['\\', '/', '\\', '\\', '/', '\\'],
    ['\\', '/', '\\', '/', '/', '/']
];

alg(testArray)
    .then((result) => {
        console.log(result);
    });

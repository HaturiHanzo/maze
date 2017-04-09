let alg = require('../algorithm');
let MatrixInput = require('./components/matrix-input/matrix-input.js');
let matrixContainer = document.getElementsByClassName('matrix-container')[0];

let matrixInput = new MatrixInput(3, 5);

matrixContainer.appendChild(matrixInput.getElement());

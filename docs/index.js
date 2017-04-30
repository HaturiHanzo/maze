// TODO: rewrite file with correct patterns and code style, it's MVP for now

'use strict';

let algorithm = require('../algorithm'),
    MatrixInput = require('./components/matrix-input/matrix-input.js'),
    MazeCanvas = require('./components/maze-canvas/maze-canvas.js');

let matrixContainer = document.getElementById('matrix-container'),
    widthInput = document.getElementById('maze-width'),
    heightInput = document.getElementById('maze-height'),
    canvasContainer = document.getElementById('canvas-container'),
    isInputValid = false,
    currentInputMatrix,
    currentMazeCanvas;

const renderResult = () => {
    if (!isInputValid) {
        return;
    }

    let intHeight = parseInt(heightInput.value),
        intWidth = parseInt(widthInput.value),
        result = algorithm(intWidth, intHeight, currentInputMatrix.getValue());

    canvasContainer.style.height = Math.round(
            canvasContainer.getBoundingClientRect().width * (heightInput.value / widthInput.value)
        ) + 'px';

    currentMazeCanvas = new MazeCanvas(canvasContainer.getBoundingClientRect(), result, currentInputMatrix.getValue());
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(currentMazeCanvas.getElement());
};

const validateInputsAndBuildMatrix = () => {
    matrixContainer.innerHTML = '';

    if (widthInput.value && heightInput.value) {
        currentInputMatrix = new MatrixInput(widthInput.value, heightInput.value, renderResult);
        matrixContainer.appendChild(currentInputMatrix.getElement());
        isInputValid = true;
        renderResult();
    }
};

widthInput.addEventListener('input', validateInputsAndBuildMatrix);
heightInput.addEventListener('input', validateInputsAndBuildMatrix);

// SETTING DEFAULT MATRIX
widthInput.value = 6;
heightInput.value = 4;

currentInputMatrix = new MatrixInput(6, 4, renderResult, [
    '\\', '/', '/', '\\' , '\\', '/',
    '\\', '/', '/', '/' , '/', '/',
    '/', '/', '\\', '\\' , '/', '\\',
    '\\', '/', '\\', '/' , '\\', '/'
]);

matrixContainer.appendChild(currentInputMatrix.getElement());
isInputValid = true;

renderResult();

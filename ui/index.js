// TODO: rewrite file with correct patterns and code style, it's MVP for now

'use strict';

let algorithm = require('../algorithm'),
    MatrixInput = require('./components/matrix-input/matrix-input.js'),
    MazeCanvas = require('./components/maze-canvas/maze-canvas.js');

let matrixContainer = document.getElementById('matrix-container'),
    widthInput = document.getElementById('maze-width'),
    heightInput = document.getElementById('maze-height'),
    sandboxForm = document.getElementById('sandbox-form'),
    canvasContainer = document.getElementById('canvas-container'),
    isInputValid = false,
    currentInputMatrix,
    currentMazeCanvas;

const validateInputsAndBuildMatrix = () => {
    matrixContainer.innerHTML = '';

    if (widthInput.value && heightInput.value) {
        currentInputMatrix = new MatrixInput(widthInput.value, heightInput.value);
        matrixContainer.appendChild(currentInputMatrix.getElement());
        isInputValid = true;
    }
};

widthInput.addEventListener('input', validateInputsAndBuildMatrix);
heightInput.addEventListener('input', validateInputsAndBuildMatrix);

sandboxForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isInputValid) {
        return;
    }

    let intHeight = parseInt(heightInput.value),
        intWidth = parseInt(widthInput.value),
        result = algorithm(intWidth, intHeight, currentInputMatrix.getValue());

    canvasContainer.style.height = Math.round(
            canvasContainer.getBoundingClientRect().width * (heightInput.value / widthInput.value)
        ) + 'px';

    currentMazeCanvas = new MazeCanvas(canvasContainer.getBoundingClientRect(), result);
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(currentMazeCanvas.getElement());
});

// DEFAULT VALUES;
widthInput.value = 6;
heightInput.value = 4;

currentInputMatrix = new MatrixInput(6, 4, [
    '\\', '/', '/', '\\' , '\\', '/',
    '\\', '/', '/', '/' , '\\', '/',
    '/', '/', '\\', '\\' , '/', '\\',
    '\\', '/', '\\', '/' , '/', '/'
]);

matrixContainer.appendChild(currentInputMatrix.getElement());
isInputValid = true;


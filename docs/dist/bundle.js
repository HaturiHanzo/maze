(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module finds closed and open cycles in an array of / and \ symbols
 */
'use strict';
const findCycles = require('./matrix-transformations/find-cycles'),
    basicTransform = require('./matrix-transformations/basic-transform'),
    filterOpenPaths = require('./matrix-transformations/filter-open-paths');

/**
 * Finds closed and open cycles in an array of / and \ symbols
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Array.<String>} maze
 * @returns {Object} result
 * @prop {Array.<Array.<Coordinates>>} result.cycles
 * @prop {Maze} result.resultMaze
 */
const run = (width, height, maze) => {
    return findCycles(filterOpenPaths(basicTransform(width, height, maze)));
};

module.exports = run;

},{"./matrix-transformations/basic-transform":2,"./matrix-transformations/filter-open-paths":3,"./matrix-transformations/find-cycles":5}],2:[function(require,module,exports){
/**
 * Module converts matrix from file format to convenient
 * for path finding format
 */
'use strict';
const Maze = require('../../maze');
/**
 * Converts matrix
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Array.<String>} maze
 * @returns {Maze}
 */
const convertMatrix = (width, height, maze) => {
    let localOffset = width * 2;

    return maze.map((elem) => {
           return elem === '/' ? [0, 1, 1, 0] : [1, 0, 0, 1];
        })
        .reduce((result, elem, index) => {
            let glOffset = parseInt(index / width, 10) * localOffset,
                dbIdx = index * 2;

            result[glOffset + dbIdx] = elem[0];
            result[glOffset + dbIdx + 1] = elem[1];
            result[glOffset + dbIdx + localOffset] = elem[2];
            result[glOffset + dbIdx + localOffset + 1] = elem[3];

            return result;
        }, new Maze(width, height));
};

module.exports = convertMatrix;

},{"../../maze":7}],3:[function(require,module,exports){
/**
 * Module finds open paths in maze and turns them to Maze.FILED_TYPES.OPEN_PATH
 */
'use strict';

const Maze = require('../../maze'),
    MOVEMENTS = require('../movements'),
    filters = require('../filters');

/**
 * Searches for open paths
 *
 * @param {Maze} maze
 * @param {Coordinates} c
 */
const searchForOpenPaths = (maze, c) => {
    let moves, touchesWithBound, nextVal, isOnTheEdge;

    moves = filters.positionFilter(c);

    // Checks if element has movement to non existing field
    isOnTheEdge = moves.some((move) => {
        return filters.checkBoundViolation(MOVEMENTS[move](c), maze);
    });

    if (isOnTheEdge) {
        maze.setElem(c, Maze.FILED_TYPES.OPEN_PATH);
        return Maze.FILED_TYPES.OPEN_PATH;
    }

    // Filters useless paths
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.WALL);
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_VAL);
    moves = filters.crossFieldFilter(maze, c, moves);

    if (!moves.length) {
        return Maze.FILED_TYPES.EMPTY;
    }

    // Checks if any move has touch with open path
    touchesWithBound = moves.some((move) => {
        return maze.getElem(MOVEMENTS[move](c)) === Maze.FILED_TYPES.OPEN_PATH;
    });

    if (touchesWithBound) {
        maze.setElem(c, Maze.FILED_TYPES.OPEN_PATH);
        return Maze.FILED_TYPES.OPEN_PATH;
    }

    maze.setElem(c, Maze.FILED_TYPES.TEMP_VAL);
    nextVal = searchForOpenPaths(maze, MOVEMENTS[moves[0]](c));
    maze.setElem(c, nextVal);


    return nextVal;
};

/**
 * Finds open paths in maze and turns them to Maze.FILED_TYPES.OPEN_PATH
 *
 * @param {Maze} maze
 * @returns {Maze}
 */
const convertMatrix = (maze) => {
    let mazeCopy = maze.clone();

    mazeCopy.forEach((elem, c) => {
        if (elem === Maze.FILED_TYPES.EMPTY) {
            searchForOpenPaths(mazeCopy, c);
        }
    });

    return mazeCopy;
};

module.exports = convertMatrix;

},{"../../maze":7,"../filters":4,"../movements":6}],4:[function(require,module,exports){
/**
 * Module holds different functions for filtering available movements from set point
 */
'use strict';
const Maze = require('../../maze'),
    MOVEMENTS = require('../movements');

/**
 * Filters movements by coordinates
 *
 * @param {Coordinates} c
 * @returns {Array.<Movement>}
 */
const positionFilter = (c) => {
    let result = [];

    if (c[0] % 2 === 0) {
        result.push('m0', 'm1', 'm2');
        c[1] % 2 === 0 ? result.push('m6', 'm7') : result.push('m3', 'm4');
    } else {
        result.push('m4', 'm5', 'm6');
        c[1] % 2 === 0 ? result.push('m0', 'm7') : result.push('m2', 'm3');
    }

    return result.sort();
};

/**
 * Filters movements by field type
 *
 * @param {Maze} maze
 * @param {Coordinates} c
 * @param {Array.<Movement>} moves
 * @param {Maze.FILED_TYPES} fieldType
 * @returns {Array.<Movement>}
 */
const mazeFieldTypeFilter = (maze, c, moves, fieldType) => {
    return moves.filter((move) => {
        return maze.getElem(MOVEMENTS[move](c)) !== fieldType;
    });
};

/**
 * Filters movements by field type
 *
 * @param {Maze} maze
 * @param {Coordinates} c
 * @param {Array.<Movement>} moves
 * @returns {Array.<Movement>}
 */
const crossFieldFilter = (maze, c, moves) => {
    let xPlacement = c[0] % 2 === 0,
        yPlacement = c[1] % 2 === 0;

    return moves.filter((move) => {
        switch (move) {
            case 'm0':
                if (!xPlacement || !yPlacement) {
                    return true;
                }
                return !(_wallCheck(maze, c, 'm1') && _wallCheck(maze, c, 'm7'));
            case 'm2':
                if (!xPlacement || yPlacement) {
                    return true;
                }

                return !(_wallCheck(maze, c, 'm1') && _wallCheck(maze, c, 'm3'));
            case 'm4':
                if (xPlacement || yPlacement) {
                    return true;
                }
                return !(_wallCheck(maze, c, 'm3') && _wallCheck(maze, c, 'm5'));
            case 'm6':
                if (xPlacement || !yPlacement) {
                    return true;
                }
                return !(_wallCheck(maze, c, 'm5') && _wallCheck(maze, c, 'm7'));
            default:
                return true;
        }
    });
};

/**
 * Checks for wall move
 *
 * @param {Maze} maze
 * @param {Movement} movement
 * @param {Coordinate} c
 * @private
 * @returns {Boolean}
 */
const _wallCheck = (maze, c, movement) => {
    return maze.getElem(MOVEMENTS[movement](c)) === Maze.FILED_TYPES.WALL;
};

/**
 * Checks bound violation
 *
 * @param {Coordinates} c
 * @param {Maze} maze
 * @returns {Boolean}
 */
const checkBoundViolation = (c, maze) => {
    return !(c[0] > -1 && c[0] < maze.realHeight && c[1] > -1 && c[1] < maze.realWidth);
};

/**
 * Movements sort function
 *
 * @param {Movement} move1
 * @param {Movement} move2
 * @returns {Boolean}
 */
const sortMovements = (move1, move2) => {
    let move1Index = parseInt(move1[1]),
        move2Index = parseInt(move2[1]);

    if (move1Index % 2 !== 0 && move2Index % 2 === 0) {
        return false;
    } else if (move1Index % 2 === 0 && move2Index % 2 !== 0) {
        return true;
    }

    return move1Index > move2Index;
};

module.exports = {
    mazeFieldTypeFilter: mazeFieldTypeFilter,
    positionFilter: positionFilter,
    checkBoundViolation: checkBoundViolation,
    crossFieldFilter: crossFieldFilter,
    sortMovements: sortMovements
};
},{"../../maze":7,"../movements":6}],5:[function(require,module,exports){
/**
 * Module finds cycles in a filtered maze
 */
'use strict';

const Maze = require('../../maze'),
    MOVEMENTS = require('../movements'),
    filters = require('../filters');

/**
 * Counts cycle length and it's coordinates
 *
 * @param {Maze} maze
 * @param {Coordinates} startCoordinate
 * @returns {Object} result
 * @prop {Array.<Array.<Coordinates>>} result.cycles
 * @prop {Maze} result.resultMaze
 */
const processCycle = (maze, startCoordinate) => {
    let steps = [];

    const recursionSearch = (c) => {
        let moves, nextVal, hasTouchWithStartCoordinate, tmpMovesLength;

        moves = filters.positionFilter(c);
        // Filters useless paths
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.WALL);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.OPEN_PATH);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_VAL);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.CLOSED_CYCLE);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.OPENED_CYCLE);
        moves = filters.crossFieldFilter(maze, c, moves);

        tmpMovesLength = moves.length;
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_START_VAL);
        hasTouchWithStartCoordinate = tmpMovesLength > moves.length;

        moves.sort(filters.sortMovements);


        if (!moves.length) {
            steps.push(c);
            let fieldType = hasTouchWithStartCoordinate ?
                Maze.FILED_TYPES.CLOSED_CYCLE :
                Maze.FILED_TYPES.OPENED_CYCLE;
            maze.setElem(c, fieldType);

            return fieldType;
        }

        if (maze.getElem(c) !== Maze.FILED_TYPES.TEMP_START_VAL) {
            maze.setElem(c, Maze.FILED_TYPES.TEMP_VAL);
        }

        nextVal = recursionSearch(MOVEMENTS[moves[0]](c));
        maze.setElem(c, nextVal);
        steps.unshift(c);

        return nextVal;
    };

    maze.setElem(startCoordinate, Maze.FILED_TYPES.TEMP_START_VAL);
    recursionSearch(startCoordinate);

    return steps;
};

/**
 * Finds cycles in a filtered maze
 *
 * @param {Maze} maze
 * @returns {Array.<Number>}
 */
const findPaths = (maze) => {
    let mazeCopy = maze.clone(),
        result = [];

    mazeCopy.forEach((elem, c) => {
        if (elem === Maze.FILED_TYPES.EMPTY) {
            result.push(processCycle(mazeCopy, c));
        }
    });

    return {
        resultMaze: mazeCopy,
        cycles: result
    };
};

module.exports = findPaths;

},{"../../maze":7,"../filters":4,"../movements":6}],6:[function(require,module,exports){
/**
 * Module creates a map between available moves and coordinates changes
 */

/**
 * Describes movement keys based starting from top left in clockwise order
 *
 * @typedef {('m0'|'m1'|'m2'|'m3'|'m4'|'m5'|'m6'|'m7')} Movement
 */
'use strict';

const MOVEMENTS = {
    /**
     * TOP LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m0: (c) => {
        return [c[0] - 1, c[1] - 1];
    },

    /**
     * TOP movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m1: (c) => {
        return [c[0] - 1, c[1]];
    },

    /**
     * TOP RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m2: (c) => {
        return [c[0] - 1, c[1] + 1];
    },

    /**
     * RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m3: (c) => {
        return [c[0], c[1] + 1];
    },

    /**
     * BOTTOM RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m4: (c) => {
        return [c[0] + 1, c[1] + 1];
    },

    /**
     * BOTTOM movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m5: (c) => {
        return [c[0] + 1, c[1]];
    },

    /**
     * BOTTOM LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m6: (c) => {
        return [c[0] + 1, c[1] - 1];
    },

    /**
     * LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m7: (c) => {
        return [c[0], c[1] - 1];
    }
};

module.exports = MOVEMENTS;
},{}],7:[function(require,module,exports){
/**
 * Module holds Maze class
 * which extends Array class and allows to works with 1 dimensional array like with
 * 2 dimensional matrix
 */

/**
 * @typedef {Array} Coordinate
 * @prop {Number} Coordinate[0] I coordinate
 * @prop {Number} Coordinate[1] J coordinate
 */
'use strict';

class Maze extends Array {
    /**
     * Constructs Maze
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Array|...Number} [elements]
     */
    constructor(width, height, ...elements) {
        if (elements.length) {
            if (elements[0] instanceof Array) {
                super(...elements[0]);
            } else {
                super(...elements);
            }
        } else {
            super();
        }

        this.width = width;
        this.height = height;
        this.realHeight = this.height * 2;
        this.realWidth = this.width * 2;
    }

    /**
     * Element getter
     *
     * @param {Coordinate} c
     * @returns {*}
     */
    getElem(c) {
        return this[_countLinearOffset.call(this, c)];
    }

    /**
     * Element setter
     *
     * @param {Coordinate} c
     * @param {*} val
     * @returns {Maze}
     */
    setElem(c, val) {
        this[_countLinearOffset.call(this, c)] = val;
        return this;
    }

    /**
     * forEach override method
     *
     * @param {Function} callback
     * @override {Array.prototype.forEach}
     */
    forEach(callback) {
        for (var i = 0; i < this.realHeight; i++) {
            for (let j = 0; j < this.realWidth; j++) {
                let c = [i, j];
                callback(this.getElem(c), c, this);
            }
        }
    }

    /**
     * toString override method
     *
     * @override {Object.prototype.toString}
     */
    toString() {
        let strMaze = '';

        this.forEach((elem, c, maze) => {
            strMaze += elem + (c[1] === maze.realWidth - 1 ? '\n' : '');
        });

        return strMaze;
    }

    /**
     * Clones maze
     * @returns {Maze}
     */
    clone() {
        return new Maze(this.width, this.height, this.slice());
    }
}

Maze.FILED_TYPES = {
    EMPTY: 0,
    WALL: 1,
    OPEN_PATH: 2,
    CLOSED_CYCLE: 3,
    OPENED_CYCLE: 4,
    TEMP_VAL: 10,
    TEMP_START_VAL: 11
};

/**
 * Converts matrix i,j to linear maze offset
 *
 * @param {Coordinate} c
 * @private
 */
function _countLinearOffset (c) {
    return this.realWidth * c[0] + c[1];
}

module.exports = Maze;
},{}],8:[function(require,module,exports){
/**
 * Component holds class for rendering matrix with buttons
 */

'use strict';

class MatrixInput {
    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Function} onChange callback which has to be called when used us changing buttons set
     * @param {Array.<String>} [elements]
     */
    constructor(width, height, onChange, elements) {
        this._element = null;
        this.onChange = onChange;
        this.width = width;
        this.height = height;
        if (!elements || !elements.length) {
            this.elements = new Array(this.width * this.height).fill('/');
        } else {
            this.elements = elements;
        }

        this._generateElement();
    }

    /**
     * Selected value getter
     *
     * @returns {Array.<String>}
     */
    getValue() {
        return this.elements;
    }

    /**
     * Dom element getter
     *
     * @returns {HTMLElement}
     */
    getElement() {
        return this._element;
    }

    /**
     * Generates matrix input
     *
     * @private
     */
    _generateElement() {
        this._element = document.createElement('div');

        for (let i = 0; i < this.height; i++) {
            let buttonsBlock = document.createElement('div');
            for(let j = 0; j < this.width; j++) {
                buttonsBlock.appendChild(this._generateButton(this.width * i + j));
            }
            this._element.appendChild(buttonsBlock);
        }

        this._element.addEventListener('click', (event) => {
            let target = event.target,
                index = target.getAttribute('data-index');

            if (index === null) {
                return;
            }

            let nextValue = '/';
            index = parseInt(index, 10);

            if (target.getAttribute('value') === '/') {
                nextValue = '\\';
            }

            target.setAttribute('value', nextValue);
            this.elements[index] = nextValue;
            this.onChange();
        });
    }

    /**
     * Generates toggleable button
     *
     * @param {Number} index
     * @returns {Element}
     * @private
     */
    _generateButton (index) {
        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', this.elements[index]);
        button.setAttribute('data-index', index.toString());

        return button;
    }
}

module.exports = MatrixInput;
},{}],9:[function(require,module,exports){
// TODO: rewrite file with correct patterns and code style, it's MVP for now

/**
 * Component holds class which is rendering algorithm result on a canvas element
 */

const Maze = require('../../../algorithm/maze');

'use strict';

const BLOCK_OFFSET = 7;
const PATH_CIRCLE_R = 10;
const PATH_COLORS = {
    [Maze.FILED_TYPES.OPEN_PATH]: '#DEA5A4',
    [Maze.FILED_TYPES.CLOSED_CYCLE]: '#77DD77',
    [Maze.FILED_TYPES.OPENED_CYCLE]: '#070'
};

class MazeCanvas {
    /**
     * Constructs canvas in passed container
     *
     * @param {Object} containerSize Container boundary rect
     * @param {Maze} maze
     * @param {Array('/' | '\\')} inputMatrix
     */
    constructor(containerSize, maze, inputMatrix) {
        this._maze = maze.resultMaze;
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext("2d");
        this._ctx.canvas.width = containerSize.width;
        this._ctx.canvas.height = containerSize.height;

        this._countBlockWidth();
        this._drawNet();
        this._drawWalls(inputMatrix);
        this._drawPaths();
    }

    /**
     * Dom element getter
     * @returns {HTMLElement}
     */
    getElement() {
        return this._canvas;
    }

    /**
     * Draws canvas line
     *
     * @param {Coordinate} from
     * @param {Coordinate} to
     */
    drawLine(from, to) {
        this._ctx.beginPath();
        this._ctx.moveTo(from[0], from[1]);
        this._ctx.lineTo(to[0], to[1]);
        this._ctx.stroke();
    }

    /**
     * Draws a circle
     *
     * @param {Coordinate} center
     * @param {number} radius
     * @param {boolean} fill=true
     */
    drawCircle(center, radius, fill = true) {
        this._ctx.beginPath();
        this._ctx.arc(center[0], center[1], radius, 0, 2*Math.PI);
        if (fill) {
            this._ctx.fill();
        }
        this._ctx.stroke();
    }

    /**
     * Canvas context prop getter
     *
     * @param {string} prop
     * @param {*} value
     * @private
     */
    _setCtxProp(prop, value) {
        this._ctx[prop] = value;
    }

    /**
     * Counts symbol block height and width
     *
     * @private
     */
    _countBlockWidth() {
        this._blockWidth = this._ctx.canvas.width / this._maze.width;
        this._blockHeight = this._ctx.canvas.height / this._maze.height;
    }

    /**
     * Draws paths circles
     *
     * @private
     */
    _drawPaths() {
        this._setCtxProp('lineWidth', 3);
        let halfWidth = this._blockWidth / 2;
        let halfHeight = this._blockHeight / 2;

        this._maze.forEach((elem, coordinates) => {
            let isOddYCoordinate = (coordinates[0] % 2 === 0);
            let isOddXCoordinate = (coordinates[1] % 2 === 0);
            let center1, center2;
            let color = PATH_COLORS[elem];

            // it's not a path element
            if (!color) {
                return;
            }

            this._setCtxProp('fillStyle', color);
            this._setCtxProp('strokeStyle', color);

            if (isOddYCoordinate ^ isOddXCoordinate) {
                center1 = [
                    halfWidth * coordinates[1],
                    halfHeight * coordinates[0]
                ];

                center2 = [
                    halfWidth * (coordinates[1] + 1),
                    halfHeight * (coordinates[0] + 1)
                ];
            } else {
                center1 = [
                    halfWidth * (coordinates[1] + 1),
                    halfHeight * coordinates[0]
                ];

                center2 = [
                    halfWidth * coordinates[1],
                    halfHeight * (coordinates[0] + 1)
                ];
            }

            this.drawCircle(center1, PATH_CIRCLE_R);
            this.drawCircle(center2, PATH_CIRCLE_R);
        });
    }

    /**
     * Draws walls elements
     * @param {Array('/'|'\\')}inputMatrix
     * @private
     */
    _drawWalls(inputMatrix) {
        this._setCtxProp('lineWidth', 5);
        this._setCtxProp('strokeStyle', '#00f');

        for (let i = 0; i < this._maze.height; i++) {
            for (let j = 0; j < this._maze.width; j++) {
                let from = [
                    this._blockWidth * j,
                    this._blockHeight * i
                ];
                let to = [
                    this._blockWidth * j,
                    this._blockHeight * i
                ];

                switch (inputMatrix[i * this._maze.width + j]) {
                    case '\\':
                        from[0] += BLOCK_OFFSET;
                        from[1] += BLOCK_OFFSET;
                        to[0] += this._blockWidth - BLOCK_OFFSET;
                        to[1] += this._blockHeight - BLOCK_OFFSET;
                        break;
                    case '/':
                        from[0] += this._blockWidth - BLOCK_OFFSET;
                        from[1] += BLOCK_OFFSET;
                        to[0] += BLOCK_OFFSET;
                        to[1] += this._blockHeight - BLOCK_OFFSET;
                        break;
                }

                this.drawLine(from, to);
            }
        }
    }

    /**
     * Draws net
     * @private
     */
    _drawNet() {
        this._setCtxProp('lineWidth', 1);
        // TODO: in some cases cycles are drawing on nonexisting coordinates
        for (let i = this._maze.height - 1; i > -1; i--) {
            this.drawLine(
                [0, this._blockHeight * i],
                [(this._maze.height - i) * this._blockWidth, this._ctx.canvas.height]
            );

            this.drawLine(
                [this._ctx.canvas.width, this._blockHeight * i],
                [this._blockWidth * (this._maze.width - (this._maze.height - i)), this._ctx.canvas.height]
            );
        }

        for (let i = 1; i < this._maze.width; i++) {
            this.drawLine(
                [this._blockWidth * i, 0],
                [this._ctx.canvas.width, (this._maze.width - i) * this._blockWidth]
            );

            this.drawLine(
                [this._blockWidth * (this._maze.width - i), 0],
                [(this._maze.width - i - this._maze.height), (this._maze.width - i) * this._blockHeight]
            );
        }
    }
}

module.exports = MazeCanvas;
},{"../../../algorithm/maze":7}],10:[function(require,module,exports){
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

},{"../algorithm":1,"./components/matrix-input/matrix-input.js":8,"./components/maze-canvas/maze-canvas.js":9}]},{},[10]);

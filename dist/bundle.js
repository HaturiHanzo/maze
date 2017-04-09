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
     * @param {Array.<String>} [elements]
     */
    constructor(width, height, elements) {
        this._element = null;
        this.width = width;
        this.height = height;
        if (!elements || !elements.length) {
            this.elements = new Array(this.width * this.height).fill('/');
        } else {
            this.elements = elements;
        }

        this._generateElement();
    }

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
        button.setAttribute('index', index.toString());
        button.setAttribute('value', this.elements[index]);

        button.addEventListener('click', () => {
            let nextValue = '/';

            if (button.getAttribute('value') === '/') {
                nextValue = '\\';
            }

            button.setAttribute('value', nextValue);
            this.elements[index] = nextValue;
        });

        return button;
    }
}

module.exports = MatrixInput;
},{}],9:[function(require,module,exports){
let alg = require('../algorithm');
let MatrixInput = require('./components/matrix-input/matrix-input.js');
let matrixContainer = document.getElementsByClassName('matrix-container')[0];

let matrixInput = new MatrixInput(3, 5);

matrixContainer.appendChild(matrixInput.getElement());

},{"../algorithm":1,"./components/matrix-input/matrix-input.js":8}]},{},[9]);

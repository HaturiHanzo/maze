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
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

    return result;
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
 * Checks bound violation
 *
 * @param {Coordinates} c
 * @param {Maze} maze
 * @returns {Boolean}
 */
const checkBoundViolation = (c, maze) => {
    return !(c[0] > -1 && c[0] < maze.realHeight && c[1] > -1 && c[1] < maze.realWidth);
};

module.exports = {
    mazeFieldTypeFilter: mazeFieldTypeFilter,
    positionFilter: positionFilter,
    checkBoundViolation: checkBoundViolation
};
/**
 * Module finds closed and open cycles in an array of / and \ symbols
 */
'use strict';
const findCycles = require('../matrix-transformations/find-cycles'),
    basicTransform = require('../matrix-transformations/basic-transform'),
    filterOpenPaths = require('../matrix-transformations/filter-open-paths');

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

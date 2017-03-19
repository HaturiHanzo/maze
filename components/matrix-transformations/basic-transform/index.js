/**
 * Module converts matrix from file format to convenient
 * for path finding format
 */
'use strict';

/**
 * Converts matrix
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Array.<String>} maze
 * @returns {Array.<Number>}
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
        }, new Array(maze.length * 4));
};

module.exports = convertMatrix;

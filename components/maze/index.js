/**
 * Module holds Maze class
 * which extends Array class and allows to works with 1 dimensional array like with
 * 2 dimensional matrix
 */
'use strict';

class Maze extends Array {
    /**
     * Constructs Maze
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Array} arr
     */
    constructor(width, height, arr) {
        if (width * height !== elements.length) {
            throw new Error('Incorrect number of arguments');
        }

        this.width = width;
        this.height = height;
        this.origin = elements;
    }
}

module.exports = Maze;
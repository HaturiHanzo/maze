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
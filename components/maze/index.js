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
     * toString override method
     *
     * @override
     */
    toString() {
        let strMaze = '';

        for (var i = 0; i < this.realHeight; i++) {
            for (let j = 0; j < this.realWidth; j++) {
                strMaze += this[i * this.realWidth + j];
            }
            strMaze += '\n';
        }

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
    TEMP_VAL: 10
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
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
    }

    /**
     * Element getter
     *
     * @param {Number} i
     * @param {Number} j
     * @returns {*}
     */
    getElem(i, j) {
        return this[this.width * 2 * i + j];
    }

    /**
     * Element setter
     *
     * @param {Number} i
     * @param {Number} j
     * @param {*} val
     * @returns {Maze}
     */
    setElem(i, j, val) {
        this[this.width * 2 * i + j] = val;
        return this;
    }

    /**
     * toString override method
     *
     * @override
     */
    toString() {
        let dbW = this.width * 2,
            dbH = this.height * 2,
            strMaze = '';

        for (var i = 0; i < dbH; i++) {
            for (let j = 0; j < dbW; j++) {
                strMaze += this[i * dbW + j];
            }
            strMaze += '\n';
        }

        return strMaze;
    }
}

module.exports = Maze;
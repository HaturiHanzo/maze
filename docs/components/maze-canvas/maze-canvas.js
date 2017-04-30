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
// TODO: rewrite file with correct patterns and code style, it's MVP for now

/**
 * Component holds class for rendering matrix with buttons
 */

'use strict';

const BLOCK_OFFSET = 5;

class MazeCanvas {
    /**
     * Constructs canvas in passed container
     *
     * @param {Object} containerSize Container boundary rect
     * @param {Maze} maze
     */
    constructor(containerSize, maze) {
        this._maze = maze.resultMaze;
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext("2d");
        this._ctx.canvas.width = containerSize.width;
        this._ctx.canvas.height = containerSize.height;

        this._drawNet();
    }

    /**
     * Draws canvas line
     *
     * @param {Coordinate} from
     * @param {Coordinate} to
     */
    drawLine(from, to) {
        this._ctx.lineWidth = 1;
        this._ctx.beginPath();
        this._ctx.moveTo(from[0], from[1]);
        this._ctx.lineTo(to[0], to[1]);
        this._ctx.stroke();
    }

    _countBlockWidth() {
        this._blockWidth = this._ctx.canvas.width / this._maze.width;
        this._blockHeight = this._ctx.canvas.height / this._maze.height;
    }

    _drawNet() {
        // TODO: in some cases cycles are drowing on nonexisting coordinates
        this._countBlockWidth();
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

    getElement() {
        return this._canvas;
    }
}

module.exports = MazeCanvas;
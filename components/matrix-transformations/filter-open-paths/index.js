/**
 * Module finds open paths in maze and turns them to Maze.FILED_TYPES.OPEN_PATH
 */
'use strict';

const Maze = require('../../maze'),
    MOVEMENTS = require('../movements'),
    filters = require('../filters');

/**
 * Searches for open paths
 *
 * @param {Maze} maze
 * @param {Coordinates} c
 */
const searchForOpenPaths = (maze, c) => {
    let moves, touchesWithBound, nextVal;

    moves = filters.positionFilter(c);
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.WALL);
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_VAL);

    if (!moves.length) {
        return Maze.FILED_TYPES.EMPTY;
    }

    touchesWithBound = moves.some((move) => {
        return maze.getElem(MOVEMENTS[move](c)) === Maze.FILED_TYPES.OPEN_PATH;
    });

    if (touchesWithBound) {
        maze.setElem(c, Maze.FILED_TYPES.OPEN_PATH);
        return Maze.FILED_TYPES.OPEN_PATH;
    }

    maze.setElem(c, Maze.FILED_TYPES.TEMP_VAL);
    nextVal = searchForOpenPaths(maze, MOVEMENTS[moves[0]](c));
    maze.setElem(c, nextVal);

    return nextVal;
};

/**
 * Finds open paths in maze and turns them to Maze.FILED_TYPES.OPEN_PATH
 *
 * @param {Maze} maze
 * @returns {Maze}
 */
const convertMatrix = (maze) => {
    let mazeCopy = maze.clone();

    for (let i = 0; i < mazeCopy.realHeight; i++) {
        for (let j = 0; j < mazeCopy.realWidth; j++) {
            if (i * j === 0 || i === mazeCopy.realHeight - 1 || j === mazeCopy.realWidth - 1) {
                let c = [i, j];
                if (mazeCopy.getElem(c) === Maze.FILED_TYPES.EMPTY) {
                    mazeCopy.setElem(c, Maze.FILED_TYPES.OPEN_PATH);
                }
            }
        }
    }

    for (let i = 1; i < mazeCopy.realHeight - 1; i++) {
        for (let j = 1; j < mazeCopy.realWidth - 1; j++) {
            if (mazeCopy.getElem([i, j]) === Maze.FILED_TYPES.EMPTY) {
                searchForOpenPaths(mazeCopy, [i, j]);
            }
        }
    }

    return mazeCopy;
};

module.exports = convertMatrix;

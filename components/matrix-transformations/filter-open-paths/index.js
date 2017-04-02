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
    let moves, touchesWithBound, nextVal, isOnTheEdge;

    moves = filters.positionFilter(c);

    // Checks if element has movement to non existing field
    isOnTheEdge = moves.some((move) => {
        return filters.checkBoundViolation(MOVEMENTS[move](c), maze);
    });

    if (isOnTheEdge) {
        maze.setElem(c, Maze.FILED_TYPES.OPEN_PATH);
        return Maze.FILED_TYPES.OPEN_PATH;
    }

    // Filters useless paths
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.WALL);
    moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_VAL);
    moves = filters.crossFieldFilter(maze, c, moves);

    if (!moves.length) {
        return Maze.FILED_TYPES.EMPTY;
    }

    // Checks if any move has touch with open path
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

    mazeCopy.forEach((elem, c) => {
        if (elem === Maze.FILED_TYPES.EMPTY) {
            searchForOpenPaths(mazeCopy, c);
        }
    });

    return mazeCopy;
};

module.exports = convertMatrix;

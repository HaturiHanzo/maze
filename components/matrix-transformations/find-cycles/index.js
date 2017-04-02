/**
 * Module finds cycles in a filtered maze
 */
'use strict';

const Maze = require('../../maze'),
    MOVEMENTS = require('../movements'),
    filters = require('../filters');

/**
 * Counts cycle length and it's coordinates
 *
 * @param {Maze} maze
 * @param {Coordinates} startCoordinate
 * @returns {Array.<Coordinates>}
 */
const processCycle = (maze, startCoordinate) => {
    let steps = [];

    const recursionSearch = (c) => {
        let moves, nextVal, hasTouchWithStartCoordinate, tmpMovesLength;

        moves = filters.positionFilter(c);
        // Filters useless paths
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.WALL);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.OPEN_PATH);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_VAL);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.CLOSED_CYCLE);
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.OPENED_CYCLE);
        moves = filters.crossFieldFilter(maze, c, moves);

        tmpMovesLength = moves.length;
        moves = filters.mazeFieldTypeFilter(maze, c, moves, Maze.FILED_TYPES.TEMP_START_VAL);
        hasTouchWithStartCoordinate = tmpMovesLength > moves.length;

        moves.sort(filters.sortMovements);


        if (!moves.length) {
            steps.push(c);
            let fieldType = hasTouchWithStartCoordinate ?
                Maze.FILED_TYPES.CLOSED_CYCLE :
                Maze.FILED_TYPES.OPENED_CYCLE;
            maze.setElem(c, fieldType);

            return fieldType;
        }

        if (maze.getElem(c) !== Maze.FILED_TYPES.TEMP_START_VAL) {
            maze.setElem(c, Maze.FILED_TYPES.TEMP_VAL);
        }

        nextVal = recursionSearch(MOVEMENTS[moves[0]](c));
        maze.setElem(c, nextVal);
        steps.unshift(c);

        return nextVal;
    };

    maze.setElem(startCoordinate, Maze.FILED_TYPES.TEMP_START_VAL);
    recursionSearch(startCoordinate);

    return steps;
};

/**
 * Finds cycles in a filtered maze
 *
 * @param {Maze} maze
 * @returns {Array.<Number>}
 */
const findPaths = (maze) => {
    let mazeCopy = maze.clone(),
        result = [];

    mazeCopy.forEach((elem, c) => {
        if (elem === Maze.FILED_TYPES.EMPTY) {
            result.push(processCycle(mazeCopy, c));
        }
    });

    return {
        resultMaze: mazeCopy,
        cycles: result
    };
};

module.exports = findPaths;

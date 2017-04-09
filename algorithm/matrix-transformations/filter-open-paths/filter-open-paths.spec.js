'use strict';

const expect = require('chai').expect,
    filterOpenPaths = require('./index.js'),
    Maze = require('../../maze');

describe('filter-open-paths.spec.js', () => {
    let inputMaze, resultMaze;

    before(() => {
        inputMaze = new Maze(3, 2, [
            0, 1, 1, 0, 1, 0,
            1, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 1,
            0, 1, 1, 0, 1, 0
        ]);
    });

    beforeEach(() => {
        resultMaze = filterOpenPaths(inputMaze);
    });

    it('returns instance of maze', () => {
        expect(resultMaze).to.be.an.instanceof(Maze);
    });

    it('all empty fields which is touching with open paths set to Maze.FILED_TYPES.OPEN_PATH', () => {
        expect(resultMaze).to.be.eql(new Maze(3, 2, [
            2, 1, 1, 2, 1, 2,
            1, 0, 0, 1, 2, 1,
            1, 0, 0, 1, 2, 1,
            2, 1, 1, 2, 1, 2
        ]));
    });
});

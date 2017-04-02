'use strict';

const expect = require('chai').expect,
    findCycles = require('./index.js'),
    basicTransform = require('../basic-transform'),
    filterOpenPaths = require('../filter-open-paths'),
    Maze = require('../../maze');

describe('find-cycles.spec.js', () => {
    let inputMaze, result;

    before(() => {
        inputMaze = filterOpenPaths(basicTransform(3, 2, [
            '/', '\\', '\\',
            '\\', '/', '/'
        ]));
    });

    beforeEach(() => {
        result = findCycles(inputMaze);
    });

    it('correctly find cycles', () => {
        expect(result).to.be.eql({
            cycles: [ [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ] ],
            resultMaze: new Maze(3, 2, [
                2, 1, 1, 2, 1, 2,
                1, 3, 3, 1, 2, 1,
                1, 3, 3, 1, 2, 1,
                2, 1, 1, 2, 1, 2
            ])
        });
    });
});

'use strict';

const expect = require('chai').expect,
    basicTransform = require('./index.js'),
    Maze = require('../../maze');

describe('basic-transform.spec.js', () => {
    let inputArray, width, height, resultMaze;

    before(() => {
        width = 3;
        height = 2;
        /**
         * Creates next maze:
         * /\\
         * \//
         */
        inputArray = ['/', '\\', '\\', '/', '/', '/'];
    });

    beforeEach(() => {
        resultMaze = basicTransform(width, height, inputArray);
    });

    it('result maze length greater than input array length in 4 times', () => {
        expect(resultMaze.length).to.be.equal(inputArray.length * 4);
    });

    it('result array correctly converted', () => {
        expect(resultMaze).to.be.eql(new Maze(3, 2, [
            0, 1, 1, 0, 1, 0,
            1, 0, 0, 1, 0, 1,
            0, 1, 0, 1, 0, 1,
            1, 0, 1, 0, 1, 0
        ]));
    });
});

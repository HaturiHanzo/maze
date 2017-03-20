'use strict';

const expect = require('chai').expect,
    filterOpenPaths = require('./index.js'),
    basicTransform = require('../basic-transform');

describe('filter-open-paths.spec.js', () => {
    let inputMaze, width, height, resultArray;

    before(() => {
        width = 3;
        height = 2;
        inputMaze = matrixConverter(width, height, ['/', '\\', '\\', '\\', '/', '/']);
    });

    beforeEach(() => {
        resultArray = filterOpenPaths(width, height, inputMaze);
    });

    it('result array correctly converted', () => {
        // TODO: write correct expect
        //expect(resultArray).to.be.eql([
        //    2, 1, 1, 2, 1, 2,
        //    1, 0, 0, 1, 2, 1,
        //    1, 0, 0, 1, 2, 1,
        //    2, 1, 1, 2, 1, 2
        //]);
    });
});

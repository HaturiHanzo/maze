'use strict';

const expect = require('chai').expect,
    filterOpenPaths = require('./index.js'),
    basicTransform = require('../basic-transform');

describe('filter-open-paths.spec.js', () => {
    let inputArray, width, height, resultArray;

    before(() => {
        width = 3;
        height = 2;
        inputArray = matrixConverter(width, height, ['/', '\\', '\\', '\\', '/', '/']);
    });

    beforeEach(() => {
        resultArray = filterOpenPaths(width, height, inputArray);
    });

    it('returns an array', () => {
        expect(resultArray).to.be.an.instanceof(Array);
    });

    it('result array length greater than input array length in 4 times', () => {
        expect(resultArray.length).to.be.equal(inputArray.length * 4);
    });

    it('result array correctly converted', () => {
        expect(resultArray).to.be.eql([
            2, 1, 1, 2, 1, 2,
            1, 0, 0, 1, 2, 1,
            1, 0, 0, 1, 2, 1,
            2, 1, 1, 2, 1, 2
        ]);
    });
});

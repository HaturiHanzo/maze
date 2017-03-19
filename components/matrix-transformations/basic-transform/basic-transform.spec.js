'use strict';

const expect = require('chai').expect,
    basicTransform = require('./index.js');
    //maze = require('../../maze');

describe('basic-transform.spec.js', () => {
    let inputArray, width, height, resultArray;

    before(() => {
        width = 3;
        height = 2;
        /**
         * Creates next maze:
         * /\\
         * ///
         */
        inputArray = ['/', '\\', '\\', '/', '/', '/'];
    });

    beforeEach(() => {
        resultArray = basicTransform(width, height, inputArray);
    });

    it('returns an array', () => {
        expect(resultArray).to.be.an.instanceof(Array);
    });

    it('result array length greater than input array length in 4 times', () => {
        expect(resultArray.length).to.be.equal(inputArray.length * 4);
    });

    it('result array correctly converted', () => {
        expect(resultArray).to.be.eql([
            0, 1, 1, 0, 1, 0,
            1, 0, 0, 1, 0, 1,
            0, 1, 0, 1, 0, 1,
            1, 0, 1, 0, 1, 0
        ]);
    });
});

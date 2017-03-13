'use strict';

const expect = require('chai').expect,
    matrixConvertor = require('./index.js');

let matrixMock = '';

describe('matrix-convertor.js', () => {
    it("Returns an array", () => {
        expect(matrixConvertor(matrixMock)).to.be.an.instanceof(Array);
    });
});

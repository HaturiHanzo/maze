//'use strict';
//
//const expect = require('chai').expect,
//    filterOpenPaths = require('./index.js'),
//    basicTransform = require('../basic-transform'),
//    Maze = require('../../maze');
//
//describe('filter-open-paths.spec.js', () => {
//    let inputMaze, width, height, resultMaze;
//
//    before(() => {
//        width = 3;
//        height = 2;
//        inputMaze = matrixConverter(width, height, ['/', '\\', '\\', '\\', '/', '/']);
//    });
//
//    beforeEach(() => {
//        resultMaze = filterOpenPaths(inputMaze);
//    });
//
//    it('returns instance of maze', () => {
//        expect(resultMaze).to.be.an.instanceof(Maze);
//    });
//
//    it('result maze correctly converted', () => {
//        expect(resultArray).to.be.eql([
//            2, 1, 1, 2, 1, 2,
//            1, 0, 0, 1, 2, 1,
//            1, 0, 0, 1, 2, 1,
//            2, 1, 1, 2, 1, 2
//        ]);
//    });
//});

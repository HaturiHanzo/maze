'use strict';

const expect = require('chai').expect,
    filters = require('./index.js'),
    Maze = require('../../maze');

describe('filters.spec.js', () => {
    let c1, c2, c3, c4, maze;

    before(() => {
        c1 = [0, 0];
        c2 = [0, 1];
        c3 = [1, 0];
        c4 = [1, 1];
        maze = new Maze(3, 2, [
            0, 1, 1, 0, 1, 0,
            1, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 1,
            0, 1, 1, 0, 1, 0
        ]);
    });

    describe('positionFilter:', () => {
        it('returns [m0, m1, m2, m6, m7] movements for point with coordinates (n + 0; m + 0)', () => {
            expect(filters.positionFilter(c1).sort()).to.be.eql(['m0', 'm1', 'm2', 'm6', 'm7'].sort());
        });

        it('returns [m0, m1, m2, m3, m4] movements for point with coordinates (n + 0; m + 1)', () => {
            expect(filters.positionFilter(c2).sort()).to.be.eql(['m0', 'm1', 'm2', 'm3', 'm4'].sort());
        });

        it('returns [m0, m4, m5, m6, m7] movements for point with coordinates (n + 1; m + 0)', () => {
            expect(filters.positionFilter(c3).sort()).to.be.eql(['m0', 'm4', 'm5', 'm6', 'm7'].sort());
        });

        it('returns [m2, m3, m4, m5, m6] movements for point with coordinates (n + 1; m + 1)', () => {
            expect(filters.positionFilter(c4).sort()).to.be.eql(['m2', 'm3', 'm4', 'm5', 'm6'].sort());
        });
    });

    describe('checkBoundViolation:', () => {
        it('returns false if coordinate is in maze', () => {
            expect(filters.checkBoundViolation([1, 1], maze)).to.be.false;
            expect(filters.checkBoundViolation([0, 0], maze)).to.be.false;
        });

        it('returns true if coordinate is out of maze', () => {
            expect(filters.checkBoundViolation([0, 100], maze)).to.be.true;
            expect(filters.checkBoundViolation([100, 0], maze)).to.be.true;
            expect(filters.checkBoundViolation([-1, 1], maze)).to.be.true;
            expect(filters.checkBoundViolation([1, -1], maze)).to.be.true;
        });
    });

    describe('mazeFieldTypeFilter:', () => {
        it('correctly filters moves to wall fields', () => {
            let moves = ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'],
                resultMoves = ['m2', 'm5', 'm6', 'm7'];
            expect(filters.mazeFieldTypeFilter(maze, [1, 2], moves, Maze.FILED_TYPES.WALL).sort()).to.be.eql(resultMoves);
        });
    });

    describe('sortMovements:', () => {
        it('correctly sorts movements array in next order top,right,bottom,left,top-left,top-right,bottom-right,bottom-left', () => {
            let movements = ['m7', 'm6', 'm5', 'm4', 'm3', 'm2', 'm1', 'm0'];
            expect(movements.sort(filters.sortMovements)).to.be.eql(['m1', 'm3', 'm5', 'm7', 'm0', 'm2', 'm4', 'm6']);
        });
    });
});

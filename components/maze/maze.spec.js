'use strict';

const expect = require('chai').expect,
    Maze = require('./index.js');

describe('maze.js', () => {
    describe('Instance of maze should ', () => {
        let maze;

        beforeEach(() => {
            /**
             * Creates next maze:
             * /\
             * \/
             */
            maze = new Maze(2, 2, '/', '\\', '\\', '/');
        });

        it('be instance of Array', () => {
            expect(maze).to.be.an.instanceof(Array);
        });

        it('contains an original array', () => {
            expect(maze.getOrigin()).to.be.equal(['/', '\\', '\\', '/']);
        });

        it('contain converted matrix', () => {
            expect(maze.getMaze()).to.be.equal([
                0, 1, 1, 0,
                1, 0, 0, 1,
                1, 0, 0, 1,
                0, 1, 1, 0
            ]);
        });

        it('contain special getters', () => {
            expect(maze.getPoint(0, 2).to.be.equal(1));
            expect(maze.getPoint(2, 1).to.be.equal(0));
        });
    });
});

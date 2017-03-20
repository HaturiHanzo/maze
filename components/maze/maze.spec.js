'use strict';

const expect = require('chai').expect,
    Maze = require('./index.js');

describe('maze.js', () => {
    describe('Instance of maze should ', () => {
        let maze1, maze2;

        beforeEach(() => {
            maze1 = new Maze(2, 2, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1);
            maze2 = new Maze(2, 2, [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
        });

        it('be instance of Array', () => {
            expect(maze1).to.be.an.instanceof(Array);
            expect(maze2).to.be.an.instanceof(Array);
        });

        it('contain elements in object root, passed as array or parameters to constructor', () => {
            expect(maze1.length).to.be.equal(16);
            expect(maze2.length).to.be.equal(16);
            expect(maze1).to.be.eql(maze2);
        });

        it('correctly get value from X,Y coordinates', () => {
            expect(maze1.getElem(1, 3)).to.be.equal(1);
        });

        it('correctly set value in X,Y coordinates', () => {
            let val = 10;
            maze1.setElem(2, 3, val);
            expect(val).to.be.equal(maze1.getElem(2, 3));
        });
    });
});

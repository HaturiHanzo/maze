'use strict';

const expect = require('chai').expect,
    MOVEMENTS = require('./index.js');

describe('movements.spec.js', () => {
    let coordinate;

    beforeEach(() => {
        coordinate = [100, 100];
    });

    describe('move: ', () => {
        it('m0 makes TOP LEFT move', () => {
            expect(MOVEMENTS.m0(coordinate)).to.be.eql([99, 99]);
        });

        it('m1 makes TOP move', () => {
            expect(MOVEMENTS.m1(coordinate)).to.be.eql([99, 100]);
        });

        it('m2 makes TOP RIGHT move', () => {
            expect(MOVEMENTS.m2(coordinate)).to.be.eql([99, 101]);
        });

        it('m3 makes RIGHT move', () => {
            expect(MOVEMENTS.m3(coordinate)).to.be.eql([100, 101]);
        });

        it('m4 makes BOTTOM RIGHT move', () => {
            expect(MOVEMENTS.m4(coordinate)).to.be.eql([101, 101]);
        });

        it('m5 makes BOTTOM move', () => {
            expect(MOVEMENTS.m5(coordinate)).to.be.eql([101, 100]);
        });

        it('m6 makes BOTTOM LEFT move', () => {
            expect(MOVEMENTS.m6(coordinate)).to.be.eql([101, 99]);
        });

        it('m7 makes LEFT move', () => {
            expect(MOVEMENTS.m7(coordinate)).to.be.eql([100, 99]);
        });
    });
});

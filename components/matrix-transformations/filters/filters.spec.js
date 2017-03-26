'use strict';

const expect = require('chai').expect,
    filters = require('./index.js');

describe('filters.spec.js', () => {
    let c1, c2, c3, c4;

    before(() => {
        c1 = [0, 0];
        c2 = [0, 1];
        c3 = [1, 0];
        c4 = [1, 1];
    });

    describe('position filter ', () => {
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
});

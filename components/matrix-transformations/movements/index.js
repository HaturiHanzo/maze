/**
 * Module creates a map between available moves and coordinates changes
 */

/**
 * Describes movement keys based starting from top left in clockwise order
 *
 * @typedef {('m0'|'m1'|'m2'|'m3'|'m4'|'m5'|'m6'|'m7')} Movement
 */
'use strict';

const MOVEMENTS = {
    /**
     * TOP LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m0: (c) => {
        return [c[0] - 1, c[1] - 1];
    },

    /**
     * TOP movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m1: (c) => {
        return [c[0] - 1, c[1]];
    },

    /**
     * TOP RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m2: (c) => {
        return [c[0] - 1, c[1] + 1];
    },

    /**
     * RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m3: (c) => {
        return [c[0], c[1] + 1];
    },

    /**
     * BOTTOM RIGHT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m4: (c) => {
        return [c[0] + 1, c[1] + 1];
    },

    /**
     * BOTTOM movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m5: (c) => {
        return [c[0] + 1, c[1]];
    },

    /**
     * BOTTOM LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m6: (c) => {
        return [c[0] + 1, c[1] - 1];
    },

    /**
     * LEFT movement
     *
     * @param {Coordinate} c
     * @returns {Coordinate}
     */
    m7: (c) => {
        return [c[0], c[1] - 1];
    }
};

module.exports = MOVEMENTS;
/**
 * Prints result matrix to console
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Array} matrix
 */
module.exports = function (width, height, matrix) {
    let dbW = width * 2,
        dbH = height * 2;

    for (var i = 0; i < dbH; i++) {
        let result = '';
        for (let j = 0; j < dbW; j++) {
            result += matrix[i * dbW + j];
        }
        console.log(result);
    }
};

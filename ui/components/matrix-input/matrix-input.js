/**
 * Component holds class for rendering matrix with buttons
 */

'use strict';

class MatrixInput {
    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Array.<String>} [elements]
     */
    constructor(width, height, elements) {
        this._element = null;
        this.width = width;
        this.height = height;
        if (!elements || !elements.length) {
            this.elements = new Array(this.width * this.height).fill('/');
        } else {
            this.elements = elements;
        }

        this._generateElement();
    }

    getElement() {
        return this._element;
    }

    /**
     * Generates matrix input
     *
     * @private
     */
    _generateElement() {
        this._element = document.createElement('div');

        for (let i = 0; i < this.height; i++) {
            let buttonsBlock = document.createElement('div');
            for(let j = 0; j < this.width; j++) {
                buttonsBlock.appendChild(this._generateButton(this.width * i + j));
            }
            this._element.appendChild(buttonsBlock);
        }
    }

    /**
     * Generates toggleable button
     *
     * @param {Number} index
     * @returns {Element}
     * @private
     */
    _generateButton (index) {
        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('index', index.toString());
        button.setAttribute('value', this.elements[index]);

        button.addEventListener('click', () => {
            let nextValue = '/';

            if (button.getAttribute('value') === '/') {
                nextValue = '\\';
            }

            button.setAttribute('value', nextValue);
            this.elements[index] = nextValue;
        });

        return button;
    }
}

module.exports = MatrixInput;
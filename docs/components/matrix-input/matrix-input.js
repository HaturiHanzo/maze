/**
 * Component holds class for rendering matrix with buttons
 */

'use strict';

class MatrixInput {
    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Function} onChange callback which has to be called when used us changing buttons set
     * @param {Array.<String>} [elements]
     */
    constructor(width, height, onChange, elements) {
        this._element = null;
        this.onChange = onChange;
        this.width = width;
        this.height = height;
        if (!elements || !elements.length) {
            this.elements = new Array(this.width * this.height).fill('/');
        } else {
            this.elements = elements;
        }

        this._generateElement();
    }

    /**
     * Selected value getter
     *
     * @returns {Array.<String>}
     */
    getValue() {
        return this.elements;
    }

    /**
     * Dom element getter
     *
     * @returns {HTMLElement}
     */
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

        this._element.addEventListener('click', (event) => {
            let target = event.target,
                index = target.getAttribute('data-index');

            if (index === null) {
                return;
            }

            let nextValue = '/';
            index = parseInt(index, 10);

            if (target.getAttribute('value') === '/') {
                nextValue = '\\';
            }

            target.setAttribute('value', nextValue);
            this.elements[index] = nextValue;
            this.onChange();
        });
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
        button.setAttribute('value', this.elements[index]);
        button.setAttribute('data-index', index.toString());

        return button;
    }
}

module.exports = MatrixInput;
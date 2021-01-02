var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _length, _charactors, _prefix, _trialLimit;
/**
 * Generate a unique ID in Document
 *
 * @version 1.1.0
 */
export default class {
    /**
     * @param {number} length - Length of ID (Excluding the prefix part)
     * @param {charactorType} charactorType - Type of characters used for ID
     * @param {string} prefix - Prefix of ID
     * @param {number} trialLimit - Maximum number of attempts if the generated ID exists in the document
     */
    constructor(length = 10, charactorType = {
        alphalower: true,
        alphaupper: true,
        number: true,
        symbol: '',
    }, prefix = '', trialLimit = 10) {
        _length.set(this, void 0);
        _charactors.set(this, void 0);
        _prefix.set(this, void 0);
        _trialLimit.set(this, void 0);
        if (length < 1) {
            throw new RangeError('The argument `length` must be greater than or equal to 1.');
        }
        let charactors = '';
        if (charactorType.alphalower) {
            charactors += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (charactorType.alphaupper) {
            charactors += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (charactorType.number) {
            charactors += '0123456789';
        }
        const charactorTypeSymbol = charactorType.symbol;
        if (charactorTypeSymbol !== undefined) {
            if (charactorTypeSymbol.search(/\s/) !== -1) {
                throw new RangeError('The argument `charactorType.symbol` must not contain any ASCII whitespace.');
            }
            if (charactorTypeSymbol.search(/[a-zA-Z0-9]/) !== -1) {
                throw new RangeError('The argument `charactorType.symbol` must not contain letter or numbers.');
            }
            charactors += charactorTypeSymbol;
        }
        if (charactors.length <= 1) {
            throw new RangeError('ID must use at least two types of characters.');
        }
        if (trialLimit < 1) {
            throw new RangeError('The argument `trialLimit` must be greater than or equal to 1.');
        }
        __classPrivateFieldSet(this, _length, length);
        __classPrivateFieldSet(this, _charactors, charactors);
        __classPrivateFieldSet(this, _prefix, prefix);
        __classPrivateFieldSet(this, _trialLimit, trialLimit);
    }
    /**
     * Generate a random string
     *
     * @returns {string} Value of ID
     */
    _getRandom() {
        const charactorsLength = __classPrivateFieldGet(this, _charactors).length;
        let id = '';
        for (let i = 0; i < __classPrivateFieldGet(this, _length); i++) {
            id += __classPrivateFieldGet(this, _charactors).charAt(Math.floor(Math.random() * charactorsLength));
        }
        return id;
    }
    /**
     * Generate a unique ID in document
     *
     * @returns {string} Value of ID
     */
    generate() {
        let id = `${__classPrivateFieldGet(this, _prefix)}${this._getRandom()}`;
        let trialCount = 1;
        while (document.getElementById(id) !== null) {
            if (trialCount >= __classPrivateFieldGet(this, _trialLimit)) {
                throw new Error('The number of ID generation attempts has exceeded the limit. You may be able to resolve this error by increasing the ID length or setting a prefix.');
            }
            id = `${__classPrivateFieldGet(this, _prefix)}${this._getRandom()}`;
            trialCount++;
        }
        return id;
    }
}
_length = new WeakMap(), _charactors = new WeakMap(), _prefix = new WeakMap(), _trialLimit = new WeakMap();

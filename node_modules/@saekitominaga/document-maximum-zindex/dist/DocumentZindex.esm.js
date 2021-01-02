var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _LIMIT;
/**
 * Processing related to `z-index` in the Document
 *
 * @version 1.1.0
 */
export default class {
    constructor() {
        _LIMIT.set(this, 2147483647); // z-index の最大値
    }
    /**
     * Get maximum value of `z-index` inside the target element
     *
     * @param {string} selectors - Target element selector (If not specified, all descendant elements of <body>)
     *
     * @returns {number} Maximum value of `z-index` inside the target element (If the element for which `z-index` is specified does not exist, it will be 0.)
     */
    getMaximum(selectors = 'body *') {
        let value = 0;
        if (document.documentElement.computedStyleMap !== undefined) {
            /* CSSStyleValue API 対応ブラウザ https://caniuse.com/mdn-api_cssstylevalue */
            for (const element of document.querySelectorAll(selectors)) {
                const zIndex = element.computedStyleMap().get('z-index');
                if (zIndex.unit === 'number' && value < zIndex.value) {
                    value = zIndex.value;
                    if (value >= __classPrivateFieldGet(this, _LIMIT)) {
                        value = __classPrivateFieldGet(this, _LIMIT);
                        continue;
                    }
                }
            }
        }
        else {
            for (const element of document.querySelectorAll(selectors)) {
                const zIndexValue = Number(getComputedStyle(element).zIndex);
                if (!Number.isNaN(zIndexValue) && value < zIndexValue) {
                    value = zIndexValue;
                    if (value >= __classPrivateFieldGet(this, _LIMIT)) {
                        value = __classPrivateFieldGet(this, _LIMIT);
                        continue;
                    }
                }
            }
        }
        return value;
    }
}
_LIMIT = new WeakMap();

/**
 * Processing related to `z-index` in the Document
 *
 * @version 1.0.0
 */
export default class {
    #private;
    /**
     * Get maximum value of `z-index` inside the target element
     *
     * @param {string} selectors - Target element selector (If not specified, all descendant elements of <body>)
     *
     * @returns {number} Maximum value of `z-index` inside the target element (If the element for which `z-index` is specified does not exist, it will be 0.)
     */
    getMaximum(selectors?: string): number;
}
//# sourceMappingURL=DocumentZindex.mjs.d.ts.map
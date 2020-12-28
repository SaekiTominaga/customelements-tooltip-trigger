/**
 * Processing related to `z-index` in the Document
 *
 * @version 1.0.0
 */
export default class {
	#LIMIT = 2147483647; // z-index の最大値

	/**
	 * Get maximum value of `z-index` inside the target element
	 *
	 * @param {string} selectors - Target element selector (If not specified, all descendant elements of <body>)
	 *
	 * @returns {number} Maximum value of `z-index` inside the target element (If the element for which `z-index` is specified does not exist, it will be 0.)
	 */
	getMaximum(selectors = 'body *'): number {
		let value = 0;

		if (document.documentElement.computedStyleMap !== undefined) {
			/* CSSStyleValue API 対応ブラウザ https://caniuse.com/mdn-api_cssstylevalue */
			for (const element of document.querySelectorAll(selectors)) {
				const zIndex = <CSSUnitValue | CSSKeywordValue>element.computedStyleMap().get('z-index');
				if ((<CSSUnitValue>zIndex).unit === 'number' && value < zIndex.value) {
					value = (<CSSUnitValue>zIndex).value;

					if (value >= this.#LIMIT) {
						value = this.#LIMIT;
						continue;
					}
				}
			}
		} else {
			for (const element of document.querySelectorAll(selectors)) {
				const zIndexValue = Number(getComputedStyle(element).zIndex);
				if (!Number.isNaN(zIndexValue) && value < zIndexValue) {
					value = zIndexValue;

					if (value >= this.#LIMIT) {
						value = this.#LIMIT;
						continue;
					}
				}
			}
		}

		return value;
	}
}

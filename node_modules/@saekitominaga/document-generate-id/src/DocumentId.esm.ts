interface charactorType {
	alphalower: boolean;
	alphaupper: boolean;
	number: boolean;
	symbol: string;
}

/**
 * Generate a unique ID in Document
 *
 * @version 1.1.0
 */
export default class {
	#length: number;
	#charactors: string;
	#prefix: string;
	#trialLimit: number;

	/**
	 * @param {number} length - Length of ID (Excluding the prefix part)
	 * @param {charactorType} charactorType - Type of characters used for ID
	 * @param {string} prefix - Prefix of ID
	 * @param {number} trialLimit - Maximum number of attempts if the generated ID exists in the document
	 */
	constructor(
		length = 10,
		charactorType: charactorType = {
			alphalower: true,
			alphaupper: true,
			number: true,
			symbol: '',
		},
		prefix = '',
		trialLimit = 10
	) {
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

		this.#length = length;
		this.#charactors = charactors;
		this.#prefix = prefix;
		this.#trialLimit = trialLimit;
	}

	/**
	 * Generate a random string
	 *
	 * @returns {string} Value of ID
	 */
	private _getRandom(): string {
		const charactorsLength = this.#charactors.length;

		let id = '';
		for (let i = 0; i < this.#length; i++) {
			id += this.#charactors.charAt(Math.floor(Math.random() * charactorsLength));
		}

		return id;
	}

	/**
	 * Generate a unique ID in document
	 *
	 * @returns {string} Value of ID
	 */
	generate(): string {
		let id = `${this.#prefix}${this._getRandom()}`;

		let trialCount = 1;
		while (document.getElementById(id) !== null) {
			if (trialCount >= this.#trialLimit) {
				throw new Error(
					'The number of ID generation attempts has exceeded the limit. You may be able to resolve this error by increasing the ID length or setting a prefix.'
				);
			}

			id = `${this.#prefix}${this._getRandom()}`;
			trialCount++;
		}

		return id;
	}
}

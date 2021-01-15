/**
 * Tooltip
 *
 * @version 1.1.0
 */
export default class Tooltip extends HTMLElement {
	#tooltipElement: HTMLElement;
	#closeButtonElement: HTMLButtonElement;
	#closeButtonImageElement: HTMLImageElement;

	#firstFocusableElement: HTMLElement; // ツールチップ内の最初にあるフォーカス可能な要素
	#lastFocusableElement: HTMLElement; // ツールチップ内の最後にあるフォーカス可能な要素

	#triggerElement: HTMLElement | null = null; // ツールチップの表示を呼び出した要素

	#closeButtonClickEventListener: () => void;
	#firstFocusableFocusEventListener: () => void;
	#lastFocusableFocusEventListener: () => void;

	static get observedAttributes(): string[] {
		return ['open', 'close-text', 'close-src'];
	}

	constructor() {
		super();

		const cssString = `
			:host {
				--tooltip-margin: 5px;
				--tooltip-padding: 15px;
				--tooltip-border-width: 1px;
				--tooltip-border-color: #ccc;
				--tooltip-border-radius: .25em;
				--tooltip-box-shadow: 0 0 .5em #666;
				--tooltip-max-width: 30em;
				--tooltip-color: #000;
				--tooltip-background: #fff;
				--tooltip-font-size: .9rem;
				--tooltip-line-height: 1.5;
				--tooltip-outline-color: #4d90fe;

				--tooltiip-close-shift: 1px; /* 右上からの距離 */
				--tooltiip-close-padding: 6px;
				--tooltiip-close-border-width: 1px;
				--tooltiip-close-border-color: transparent;
				--tooltiip-close-border-radius: 5px;
				--tooltiip-close-width: 36px;
				--tooltiip-close-height: 36px;
				--tooltiip-close-color: inherit;
				--tooltiip-close-background: transparent;
				--tooltiip-close-border-color--hover: #eee;
				--tooltiip-close-color--hover: inherit;
				--tooltiip-close-background--hover: #f8f8f8;

				margin: var(--tooltip-margin);
				position: absolute;
				display: inline-block;
			}

			:host(:not([open])) {
				display: none;
			}

			/* 実際に表示される部分 */
			.tooltip {
				padding: var(--tooltip-padding);
				border-width: var(--tooltip-border-width);
				border-style: solid;
				border-color: var(--tooltip-border-color);
				border-radius: var(--tooltip-border-radius);
				box-shadow: var(--tooltip-box-shadow);
				box-sizing: border-box;
				position: relative;
				max-width: var(--tooltip-max-width);
				color: var(--tooltip-color);
				background: var(--tooltip-background);
				font-size: var(--tooltip-font-size);
				line-height: var(--tooltip-line-height);
				outline: none;
			}

			.tooltip:focus {
				--tooltip-border-color: var(--tooltip-outline-color);
			}

			/* 閉じるボタン用の空間を確保 */
			.tooltip::before {
				float: right;
				display: block;
				width: calc(var(--tooltiip-close-width) + var(--tooltiip-close-shift) - var(--tooltip-padding));
				height: calc(var(--tooltiip-close-height) + var(--tooltiip-close-shift) - var(--tooltip-padding));
				content: "";
			}

			/* 閉じるボタン */
			.close {
				padding: var(--tooltiip-close-padding);
				border-width: var(--tooltiip-close-border-width);
				border-style: solid;
				border-color: var(--tooltiip-close-border-color);
				border-radius: var(--tooltiip-close-border-radius);
				box-sizing: border-box;
				position: absolute;
				top: var(--tooltiip-close-shift);
				right: var(--tooltiip-close-shift);
				width: var(--tooltiip-close-width);
				height: var(--tooltiip-close-height);
				color: var(--tooltiip-close-color);
				background: var(--tooltiip-close-background);
				font: inherit;
				line-height: 1;
				outline: none;
			}

			.close:hover,
			.close:focus {
				--tooltiip-close-border-color: var(--tooltiip-close-border-color--hover);
				--tooltiip-close-color: var(--tooltiip-close-color--hover);
				--tooltiip-close-background: var(--tooltiip-close-background--hover);
			}

			.close:focus {
				--tooltiip-close-border-color: var(--tooltip-outline-color);
			}

			.close img {
				display: block;
				width: 100%;
				height: 100%;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.innerHTML = `
			<span tabindex="0" id="focusable-first"></span>
			<div id="tooltip" class="tooltip" role="tooltip" tabindex="0">
				<slot name="tooltip"></slot>
				<button type="button" id="close" class="close">
					<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2Ij48c3R5bGU+cGF0aHtzdHJva2U6Izc2NzY3NjtzdHJva2Utd2lkdGg6NnB4O3N0cm9rZS1saW5lY2FwOnJvdW5kfTwvc3R5bGU+PHBhdGggZD0iTTMgM2wzMCAzME0zIDMzTDMzIDMiLz48L3N2Zz4=" alt="Close" id="close-image"/>
				</button>
			</div>
			<span tabindex="0" id="focusable-last"></span>
		`;

		if (shadow.adoptedStyleSheets !== undefined) {
			const cssStyleSheet = new CSSStyleSheet();
			cssStyleSheet.replaceSync(cssString);

			shadow.adoptedStyleSheets = [cssStyleSheet];
		} else {
			/* adoptedStyleSheets 未対応環境 */
			shadow.innerHTML += `<style>${cssString}</style>`;
		}

		const shadowRoot = <ShadowRoot>this.shadowRoot;
		this.#tooltipElement = <HTMLElement>shadowRoot.getElementById('tooltip');
		this.#closeButtonElement = <HTMLButtonElement>shadowRoot.getElementById('close');
		this.#closeButtonImageElement = <HTMLImageElement>shadowRoot.getElementById('close-image');
		this.#firstFocusableElement = <HTMLElement>shadowRoot.getElementById('focusable-first');
		this.#lastFocusableElement = <HTMLElement>shadowRoot.getElementById('focusable-last');

		this.#closeButtonClickEventListener = this._closeButtonClickEvent.bind(this);
		this.#firstFocusableFocusEventListener = this._firstFocusableFocusEvent.bind(this);
		this.#lastFocusableFocusEventListener = this._lastFocusableFocusEvent.bind(this);
	}

	connectedCallback(): void {
		this.#closeButtonElement.addEventListener('click', this.#closeButtonClickEventListener, { passive: true });

		/* 循環フォーカス */
		this.#firstFocusableElement.addEventListener('focus', this.#firstFocusableFocusEventListener, { passive: true });
		this.#lastFocusableElement.addEventListener('focus', this.#lastFocusableFocusEventListener, { passive: true });
	}

	disconnectedCallback(): void {
		this.#closeButtonElement.removeEventListener('click', this.#closeButtonClickEventListener);

		/* 循環フォーカス */
		this.#firstFocusableElement.removeEventListener('focus', this.#firstFocusableFocusEventListener);
		this.#lastFocusableElement.removeEventListener('focus', this.#lastFocusableFocusEventListener);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'open': {
				const open = newValue !== null;
				if (open) {
					this.#triggerElement = <HTMLElement | null>document.activeElement;
				} else {
					if (this.#triggerElement !== null) {
						this.#triggerElement.focus();
					}
				}
				this.setAttribute('aria-hidden', String(!open));
				break;
			}
			case 'close-text': {
				if (newValue !== null && newValue !== '') {
					this.#closeButtonImageElement.alt = newValue;
				}
				break;
			}
			case 'close-src': {
				if (newValue !== null && newValue !== '') {
					this.#closeButtonImageElement.src = newValue;
				}
				break;
			}
		}
	}

	get open(): boolean {
		return this.getAttribute('open') !== null;
	}
	set open(value: boolean) {
		if (typeof value !== 'boolean') {
			throw new Error('Only a boolean value can be specified for the `open` attribute of the <x-tooltip> element.');
		}

		if (value) {
			this.setAttribute('open', '');
		} else {
			this.removeAttribute('open');
		}
	}

	get closeText(): string | null {
		return this.getAttribute('close-text');
	}
	set closeText(value: string | null) {
		if (value !== null) {
			this.setAttribute('close-text', value);
		}
	}

	get closeSrc(): string | null {
		return this.getAttribute('close-src');
	}
	set closeSrc(value: string | null) {
		if (value !== null) {
			this.setAttribute('close-src', value);
		}
	}

	/**
	 * 閉じるボタンをクリックしたときの処理
	 */
	private _closeButtonClickEvent(): void {
		this.open = false;
	}

	/**
	 * ツールチップ内の最初にあるフォーカス可能な要素にフォーカスが移ったときの処理
	 */
	private _firstFocusableFocusEvent(): void {
		this.#closeButtonElement.focus();
	}

	/**
	 * ツールチップ内の最後にあるフォーカス可能な要素にフォーカスが移ったときの処理
	 */
	private _lastFocusableFocusEvent(): void {
		this.#tooltipElement.focus();
	}
}

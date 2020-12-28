import DocumentId from '@saekitominaga/document-generate-id';
import DocumentZindex from '@saekitominaga/document-maximum-zindex';

/**
 * Tooltip trigger
 *
 * @version 1.0.0
 */
export default class TooltipTrigger extends HTMLAnchorElement {
	#ZINDEX_LIMIT = 2147483647; // z-index の最大値

	#supportCSSTypedOM: boolean; // CSS Typed Object Model に対応しているか（Chrome 66+, Chromium Edge） https://caniuse.com/mdn-api_element_attributestylemap

	#annotateElement: HTMLElement | null = null; // ツールチップの内容をここからコピーする

	#tooltipElement: HTMLElement | null = null;
	#tooltipCustomElementName = 'x-tooltip';
	#TOOLTIP_ID_PLEFIX = 'tooltip-'; // ツールチップに設定する ID の接頭辞
	#MOUSELEAVE_HIDE_DELAY = 250; // mouseleave 時にツールチップを非表示にする遅延時間（ミリ秒）
	#mouseleaveHideTimeoutId: NodeJS.Timeout | null = null; // ツールチップを非表示にする際のタイマーの識別ID（clearTimeout() で使用）

	#tooltipInnerElement: HTMLElement | null = null;

	#tooltipCloseText: string | undefined;
	#tooltipCloseSrc: string | undefined;

	constructor() {
		super();

		this.#supportCSSTypedOM = this.attributeStyleMap !== undefined;

		this.setAttribute('role', 'button');
		this.setAttribute('aria-expanded', 'false');
	}

	connectedCallback(): void {
		const href = new URL(this.href);
		const hash = href.hash;
		if (href.origin !== location.origin || href.pathname !== location.pathname || hash === '') {
			throw new Error('Attribute: `href` is not set or the value is invalid.');
		}
		const annotateElement = document.getElementById(hash.substring(1));
		if (annotateElement === null) {
			throw new Error(`Element: ${hash} can not found.`);
		}
		this.#annotateElement = annotateElement;

		const tooltipCustomElementName = this.dataset.tooltipElement;
		if (tooltipCustomElementName !== undefined) {
			if (!tooltipCustomElementName.includes('-')) {
				throw new Error('Attribute: `data-tooltip-element` value must contain a hyphen.');
			}
			this.#tooltipCustomElementName = tooltipCustomElementName;
		}

		const tooltipCloseText = this.dataset.tooltipCloseText;
		if (tooltipCloseText === '') {
			throw new Error('Attribute: `data-tooltip-close-text` value cannot be empty.');
		}
		this.#tooltipCloseText = tooltipCloseText;

		const tooltipCloseSrc = this.dataset.tooltipCloseSrc;
		if (tooltipCloseSrc === '') {
			throw new Error('Attribute: `data-tooltip-close-src` value cannot be empty.');
		}
		this.#tooltipCloseSrc = tooltipCloseSrc;

		this.addEventListener('mouseenter', this._mouseEnterEvent, { passive: true });
		this.addEventListener('mouseleave', this._mouseLeaveEvent, { passive: true });
		this.addEventListener('click', this._clickEvent);
	}

	disconnectedCallback(): void {
		this.#tooltipElement?.remove();

		this.removeEventListener('mouseenter', this._mouseEnterEvent);
		this.removeEventListener('mouseleave', this._mouseLeaveEvent);
		this.removeEventListener('click', this._clickEvent);
	}

	private _mouseEnterEvent() {
		this._show();
	}

	private _mouseLeaveEvent() {
		this.#mouseleaveHideTimeoutId = setTimeout((): void => {
			this._hide();
		}, this.#MOUSELEAVE_HIDE_DELAY);
	}

	private _clickEvent(ev: MouseEvent) {
		this._show();
		this.#tooltipInnerElement?.focus();

		ev.preventDefault();
	}

	/**
	 * ツールチップを生成する
	 */
	private _create(): void {
		/* ツールチップのラッパー要素 */
		const tooltipElement = document.createElement(this.#tooltipCustomElementName);
		tooltipElement.id = new DocumentId(
			10,
			{
				alphalower: true,
				alphaupper: true,
				number: true,
				symbol: '',
			},
			this.#TOOLTIP_ID_PLEFIX
		).generate();
		if (this.#tooltipCloseSrc !== undefined) {
			tooltipElement.setAttribute('close-src', this.#tooltipCloseSrc);
		}
		if (this.#tooltipCloseText !== undefined) {
			tooltipElement.setAttribute('close-text', this.#tooltipCloseText);
		}
		document.body.appendChild(tooltipElement);
		this.#tooltipElement = tooltipElement;

		const tooltipInnerElement = document.createElement('div');
		tooltipInnerElement.tabIndex = -1;
		tooltipInnerElement.slot = 'tooltip';
		tooltipInnerElement.insertAdjacentHTML('afterbegin', (<HTMLElement>this.#annotateElement).innerHTML); // TODO HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまう
		if (this.#supportCSSTypedOM) {
			tooltipInnerElement.attributeStyleMap.set('outline', 'none');
		} else {
			tooltipInnerElement.style.outline = 'none';
		}
		tooltipElement.appendChild(tooltipInnerElement);
		this.#tooltipInnerElement = tooltipInnerElement;

		/* ツールチップにイベントを設定する */
		tooltipElement.addEventListener(
			'mouseenter',
			(): void => {
				this._show();
			},
			{ passive: true }
		);
		tooltipElement.addEventListener(
			'mouseleave',
			(): void => {
				this._hide();
			},
			{ passive: true }
		);
	}

	/**
	 * ツールチップを表示する
	 */
	private _show(): void {
		if (this.#tooltipElement === null) {
			/* 初回表示時はツールチップの生成を行う */
			this._create();
		}

		if (this.#mouseleaveHideTimeoutId !== null) {
			clearTimeout(this.#mouseleaveHideTimeoutId);
		}

		const tooltipElement = <HTMLElement>this.#tooltipElement;

		this.setAttribute('aria-expanded', 'true');
		this.setAttribute('aria-describedby', tooltipElement.id);
		tooltipElement.setAttribute('open', '');

		/* 表示位置を設定する */
		const triggerBoundingClientRect = this.getBoundingClientRect();

		let zIndex = new DocumentZindex().getMaximum() + 1; // z-index 値
		if (zIndex > this.#ZINDEX_LIMIT) {
			zIndex = this.#ZINDEX_LIMIT;
		}

		if (this.#supportCSSTypedOM) {
			/* いったんリセット */
			tooltipElement.attributeStyleMap.set('left', 'auto');
			tooltipElement.attributeStyleMap.set('right', 'auto');

			/* トリガー要素の左下を基準に左上を合わせる */
			tooltipElement.attributeStyleMap.set('top', CSS.px(Math.round(triggerBoundingClientRect.bottom)).add(CSS.px(window.pageYOffset)));
			if (document.documentElement.scrollWidth - triggerBoundingClientRect.left < tooltipElement.offsetWidth) {
				tooltipElement.attributeStyleMap.set('right', '0');
			} else {
				tooltipElement.attributeStyleMap.set('left', CSS.px(Math.round(triggerBoundingClientRect.left)));
			}
			tooltipElement.attributeStyleMap.set('z-index', zIndex);
		} else {
			/* いったんリセット */
			tooltipElement.style.left = 'auto';
			tooltipElement.style.right = 'auto';

			/* トリガー要素の左下を基準に左上を合わせる */
			tooltipElement.style.top = `${String(Math.round(triggerBoundingClientRect.bottom) + window.pageYOffset)}px`;
			if (document.documentElement.scrollWidth - triggerBoundingClientRect.left < tooltipElement.offsetWidth) {
				tooltipElement.style.right = '0';
			} else {
				tooltipElement.style.left = `${String(Math.round(triggerBoundingClientRect.left))}px`;
			}
			tooltipElement.style.zIndex = String(zIndex);
		}
	}

	/**
	 * ツールチップの非表示処理を行う
	 */
	private _hide(): void {
		const tooltipElement = <HTMLElement>this.#tooltipElement;

		this.setAttribute('aria-expanded', 'false');
		this.removeAttribute('aria-describedby');
		tooltipElement.removeAttribute('open');
	}
}

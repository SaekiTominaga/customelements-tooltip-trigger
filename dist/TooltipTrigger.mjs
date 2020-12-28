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
var _ZINDEX_LIMIT, _supportCSSTypedOM, _annotateElement, _tooltipElement, _tooltipCustomElementName, _TOOLTIP_ID_PLEFIX, _MOUSELEAVE_HIDE_DELAY, _mouseleaveHideTimeoutId, _tooltipInnerElement, _tooltipCloseText, _tooltipCloseSrc;
import DocumentId from '/customelements-tooltip-trigger/node_modules/@saekitominaga/document-generate-id/dist/DocumentId.mjs';
import DocumentZindex from '/customelements-tooltip-trigger/node_modules/@saekitominaga/document-maximum-zindex/dist/DocumentZindex.mjs';
/**
 * Tooltip trigger
 *
 * @version 1.0.0
 */
export default class TooltipTrigger extends HTMLAnchorElement {
    constructor() {
        super();
        _ZINDEX_LIMIT.set(this, 2147483647); // z-index の最大値
        _supportCSSTypedOM.set(this, void 0); // CSS Typed Object Model に対応しているか（Chrome 66+, Chromium Edge） https://caniuse.com/mdn-api_element_attributestylemap
        _annotateElement.set(this, null); // ツールチップの内容をここからコピーする
        _tooltipElement.set(this, null);
        _tooltipCustomElementName.set(this, 'x-tooltip');
        _TOOLTIP_ID_PLEFIX.set(this, 'tooltip-'); // ツールチップに設定する ID の接頭辞
        _MOUSELEAVE_HIDE_DELAY.set(this, 250); // mouseleave 時にツールチップを非表示にする遅延時間（ミリ秒）
        _mouseleaveHideTimeoutId.set(this, null); // ツールチップを非表示にする際のタイマーの識別ID（clearTimeout() で使用）
        _tooltipInnerElement.set(this, null);
        _tooltipCloseText.set(this, void 0);
        _tooltipCloseSrc.set(this, void 0);
        __classPrivateFieldSet(this, _supportCSSTypedOM, this.attributeStyleMap !== undefined);
        this.setAttribute('role', 'button');
        this.setAttribute('aria-expanded', 'false');
    }
    connectedCallback() {
        const href = new URL(this.href);
        const hash = href.hash;
        if (href.origin !== location.origin || href.pathname !== location.pathname || hash === '') {
            throw new Error('Attribute: `href` is not set or the value is invalid.');
        }
        const annotateElement = document.getElementById(hash.substring(1));
        if (annotateElement === null) {
            throw new Error(`Element: ${hash} can not found.`);
        }
        __classPrivateFieldSet(this, _annotateElement, annotateElement);
        const tooltipCustomElementName = this.dataset.tooltipElement;
        if (tooltipCustomElementName !== undefined) {
            if (!tooltipCustomElementName.includes('-')) {
                throw new Error('Attribute: `data-tooltip-element` value must contain a hyphen.');
            }
            __classPrivateFieldSet(this, _tooltipCustomElementName, tooltipCustomElementName);
        }
        const tooltipCloseText = this.dataset.tooltipCloseText;
        if (tooltipCloseText === '') {
            throw new Error('Attribute: `data-tooltip-close-text` value cannot be empty.');
        }
        __classPrivateFieldSet(this, _tooltipCloseText, tooltipCloseText);
        const tooltipCloseSrc = this.dataset.tooltipCloseSrc;
        if (tooltipCloseSrc === '') {
            throw new Error('Attribute: `data-tooltip-close-src` value cannot be empty.');
        }
        __classPrivateFieldSet(this, _tooltipCloseSrc, tooltipCloseSrc);
        this.addEventListener('mouseenter', this._mouseEnterEvent, { passive: true });
        this.addEventListener('mouseleave', this._mouseLeaveEvent, { passive: true });
        this.addEventListener('click', this._clickEvent);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _tooltipElement)?.remove();
        this.removeEventListener('mouseenter', this._mouseEnterEvent);
        this.removeEventListener('mouseleave', this._mouseLeaveEvent);
        this.removeEventListener('click', this._clickEvent);
    }
    _mouseEnterEvent() {
        this._show();
    }
    _mouseLeaveEvent() {
        __classPrivateFieldSet(this, _mouseleaveHideTimeoutId, setTimeout(() => {
            this._hide();
        }, __classPrivateFieldGet(this, _MOUSELEAVE_HIDE_DELAY)));
    }
    _clickEvent(ev) {
        this._show();
        __classPrivateFieldGet(this, _tooltipInnerElement)?.focus();
        ev.preventDefault();
    }
    /**
     * ツールチップを生成する
     */
    _create() {
        /* ツールチップのラッパー要素 */
        const tooltipElement = document.createElement(__classPrivateFieldGet(this, _tooltipCustomElementName));
        tooltipElement.id = new DocumentId(10, {
            alphalower: true,
            alphaupper: true,
            number: true,
            symbol: '',
        }, __classPrivateFieldGet(this, _TOOLTIP_ID_PLEFIX)).generate();
        if (__classPrivateFieldGet(this, _tooltipCloseSrc) !== undefined) {
            tooltipElement.setAttribute('close-src', __classPrivateFieldGet(this, _tooltipCloseSrc));
        }
        if (__classPrivateFieldGet(this, _tooltipCloseText) !== undefined) {
            tooltipElement.setAttribute('close-text', __classPrivateFieldGet(this, _tooltipCloseText));
        }
        document.body.appendChild(tooltipElement);
        __classPrivateFieldSet(this, _tooltipElement, tooltipElement);
        const tooltipInnerElement = document.createElement('div');
        tooltipInnerElement.tabIndex = -1;
        tooltipInnerElement.slot = 'tooltip';
        tooltipInnerElement.insertAdjacentHTML('afterbegin', __classPrivateFieldGet(this, _annotateElement).innerHTML); // TODO HTML 中に id 属性が設定されていた場合、ページ中に ID が重複してしまう
        if (__classPrivateFieldGet(this, _supportCSSTypedOM)) {
            tooltipInnerElement.attributeStyleMap.set('outline', 'none');
        }
        else {
            tooltipInnerElement.style.outline = 'none';
        }
        tooltipElement.appendChild(tooltipInnerElement);
        __classPrivateFieldSet(this, _tooltipInnerElement, tooltipInnerElement);
        /* ツールチップにイベントを設定する */
        tooltipElement.addEventListener('mouseenter', () => {
            this._show();
        }, { passive: true });
        tooltipElement.addEventListener('mouseleave', () => {
            this._hide();
        }, { passive: true });
    }
    /**
     * ツールチップを表示する
     */
    _show() {
        if (__classPrivateFieldGet(this, _tooltipElement) === null) {
            /* 初回表示時はツールチップの生成を行う */
            this._create();
        }
        if (__classPrivateFieldGet(this, _mouseleaveHideTimeoutId) !== null) {
            clearTimeout(__classPrivateFieldGet(this, _mouseleaveHideTimeoutId));
        }
        const tooltipElement = __classPrivateFieldGet(this, _tooltipElement);
        this.setAttribute('aria-expanded', 'true');
        this.setAttribute('aria-describedby', tooltipElement.id);
        tooltipElement.setAttribute('open', '');
        /* 表示位置を設定する */
        const triggerBoundingClientRect = this.getBoundingClientRect();
        let zIndex = new DocumentZindex().getMaximum() + 1; // z-index 値
        if (zIndex > __classPrivateFieldGet(this, _ZINDEX_LIMIT)) {
            zIndex = __classPrivateFieldGet(this, _ZINDEX_LIMIT);
        }
        if (__classPrivateFieldGet(this, _supportCSSTypedOM)) {
            /* いったんリセット */
            tooltipElement.attributeStyleMap.set('left', 'auto');
            tooltipElement.attributeStyleMap.set('right', 'auto');
            /* トリガー要素の左下を基準に左上を合わせる */
            tooltipElement.attributeStyleMap.set('top', CSS.px(Math.round(triggerBoundingClientRect.bottom)).add(CSS.px(window.pageYOffset)));
            if (document.documentElement.scrollWidth - triggerBoundingClientRect.left < tooltipElement.offsetWidth) {
                tooltipElement.attributeStyleMap.set('right', '0');
            }
            else {
                tooltipElement.attributeStyleMap.set('left', CSS.px(Math.round(triggerBoundingClientRect.left)));
            }
            tooltipElement.attributeStyleMap.set('z-index', zIndex);
        }
        else {
            /* いったんリセット */
            tooltipElement.style.left = 'auto';
            tooltipElement.style.right = 'auto';
            /* トリガー要素の左下を基準に左上を合わせる */
            tooltipElement.style.top = `${String(Math.round(triggerBoundingClientRect.bottom) + window.pageYOffset)}px`;
            if (document.documentElement.scrollWidth - triggerBoundingClientRect.left < tooltipElement.offsetWidth) {
                tooltipElement.style.right = '0';
            }
            else {
                tooltipElement.style.left = `${String(Math.round(triggerBoundingClientRect.left))}px`;
            }
            tooltipElement.style.zIndex = String(zIndex);
        }
    }
    /**
     * ツールチップの非表示処理を行う
     */
    _hide() {
        const tooltipElement = __classPrivateFieldGet(this, _tooltipElement);
        this.setAttribute('aria-expanded', 'false');
        this.removeAttribute('aria-describedby');
        tooltipElement.removeAttribute('open');
    }
}
_ZINDEX_LIMIT = new WeakMap(), _supportCSSTypedOM = new WeakMap(), _annotateElement = new WeakMap(), _tooltipElement = new WeakMap(), _tooltipCustomElementName = new WeakMap(), _TOOLTIP_ID_PLEFIX = new WeakMap(), _MOUSELEAVE_HIDE_DELAY = new WeakMap(), _mouseleaveHideTimeoutId = new WeakMap(), _tooltipInnerElement = new WeakMap(), _tooltipCloseText = new WeakMap(), _tooltipCloseSrc = new WeakMap();

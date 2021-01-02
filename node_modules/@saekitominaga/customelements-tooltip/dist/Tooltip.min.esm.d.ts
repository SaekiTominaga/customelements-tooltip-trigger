/**
 * Tooltip
 *
 * @version 1.1.0
 */
export default class Tooltip extends HTMLElement {
    #private;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    get open(): boolean;
    set open(value: boolean);
    get closeText(): string | null;
    set closeText(value: string | null);
    get closeSrc(): string | null;
    set closeSrc(value: string | null);
    /**
     * 閉じるボタンをクリックしたときの処理
     */
    private _closeButtonClickEvent;
    /**
     * ツールチップ内の最初にあるフォーカス可能な要素にフォーカスが移ったときの処理
     */
    private _firstFocusableFocusEvent;
    /**
     * ツールチップ内の最後にあるフォーカス可能な要素にフォーカスが移ったときの処理
     */
    private _lastFocusableFocusEvent;
}
//# sourceMappingURL=Tooltip.esm.d.ts.map
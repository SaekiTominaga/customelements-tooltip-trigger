/**
 * Tooltip trigger
 */
export default class TooltipTrigger extends HTMLAnchorElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _mouseEnterEvent;
    private _mouseLeaveEvent;
    private _clickEvent;
    /**
     * ツールチップを生成する
     */
    private _create;
    /**
     * ツールチップを表示する
     */
    private _show;
    /**
     * ツールチップの非表示処理を行う
     */
    private _hide;
}
//# sourceMappingURL=TooltipTrigger.d.ts.map
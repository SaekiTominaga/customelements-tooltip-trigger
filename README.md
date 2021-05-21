# A custom element that triggers to call the tooltip UI

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-tooltip-trigger.svg)](https://badge.fury.io/js/%40saekitominaga%2Fcustomelements-tooltip-trigger)

A custom element that triggers to call the tooltip UI.

\* The tooltip representation uses [@saekitominaga/customelements-tooltip](https://www.npmjs.com/package/@saekitominaga/customelements-tooltip).

## Demo

- [Demo page](https://saekitominaga.github.io/customelements-tooltip-trigger/demo.html)

## Examples

```HTML
<a is="x-tooltip-trigger"
  href="#annotation-1"
  data-tooltip-element="x-tooltip"
  data-tooltip-close-text="Close"
  data-tooltip-close-src="/assets/tooltip-close.svg"
>[1]</a>
<ul class="annotation">
<li id="fn-1">The text written in this part is displayed as a tooltip. It also recognizes markup such as <a href="#">anchor links</a>.</li>
</ul>

<!-- ↓ The following element are automatically inserted from JavaScript just before </body> -->
<x-tooltip></x-tooltip>
```

## Attributes

<dl>
<dt><code>href</code> [required]</dt>
<dd>URL hash value of the element that contains the content to be displayed in the tooltip. (e.g. "#annotation-1" )</dd>
<dt><code>data-tooltip-element</code> [optional]</dt>
<dd>The text of the close button in the tooltip (Image alternative text).</dd>
<dt><code>data-tooltip-close-text</code> [optional]</dt>
<dd>The text of the close button in the tooltip (Image alternative text).</dd>
<dt><code>data-tooltip-close-src</code> [optional]</dt>
<dd>The address of the image resource for the close button in the tooltip.</dd>
</dl>

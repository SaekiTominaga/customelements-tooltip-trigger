# Generate a unique ID in Document

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fdocument-generate-id.svg)](https://badge.fury.io/js/%40saekitominaga%2Fdocument-generate-id)

Generate a unique ID in Document.

## Demo

- [Demo page](https://saekitominaga.github.io/document-generate-id/demo.html)

## Examples

```
import DocumentId from '@saekitominaga/document-generate-id';

const documentId1 = new DocumentId();
documentId1.generate(); // e.g. GUaHJ6ao5m

const documentId2 = new DocumentId(8, {
  alphalower: true,
  alphaupper: false,
  number: true,
  symbol: '-_:.',
}, 'js-', 3);
documentId2.generate(); // e.g. js-7f3h1w:l
```

## Constructor

```
new DocumentId(
	length = 10,
	charactorType = {
		alphalower: true,
		alphaupper: true,
		number: true,
		symbol: '',
	},
	prefix = '',
	trialLimit = 10
)
```

### Parameters

<dl>
<dt>length [Optional]</dt>
<dd>Length of ID (Excluding the prefix part)</dd>
<dt>charactorType [Optional]</dt>
<dd>Type of characters used for ID
	<dl>
	<dt>alphalower [Optional]</dt>
	<dd>[a-z]</dd>
	<dt>alphaupper [Optional]</dt>
	<dd>[A-Z]</dd>
	<dt>number [Optional]</dt>
	<dd>[0-9]</dd>
	<dt>symbol [Optional]</dt>
	<dd>Enumerate symbol characters (e.g. '-_:.')</dd>
	</dl>
</dd>
<dt>prefix [Optional]</dt>
<dd>Prefix of ID</dd>
<dt>trialLimit [Optional]</dt>
<dd>Maximum number of attempts if the generated ID exists in the document</dd>
</dl>

## Methods

| Name | Returns | Description |
|-|-|-|
| generate() | {string} Value of ID | Generate a unique ID in document |

# rich-to-word

[![NPM version](https://img.shields.io/npm/v/rich-to-word.svg?style=flat)](https://npmjs.org/package/rich-to-word)
[![NPM downloads](http://img.shields.io/npm/dm/rich-to-word.svg?style=flat)](https://npmjs.org/package/rich-to-word)

## Use

```js
import richToWord from rich-to-word;

const richText = `<p>hello rich-to-word</p><p><img src="https://avatars.githubusercontent.com/u/8125081?v=4" alt="" data-href="" style=""/></p>`

const blob = await richToWord(html);
const link = document.createElement('a');
const blobUrl = window.URL.createObjectURL(blob);
link.href = blobUrl;
link.download = 'test.docx';
link.click();

```

## LICENSE

MIT

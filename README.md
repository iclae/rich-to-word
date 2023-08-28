# rich-to-word

[![NPM version](https://img.shields.io/npm/v/rich-to-word.svg?style=flat)](https://npmjs.org/package/rich-to-word)
[![NPM downloads](http://img.shields.io/npm/dm/rich-to-word.svg?style=flat)](https://npmjs.org/package/rich-to-word)



## Installation

```bash
npm install rich-to-word
```

## Use

```js
import richToWord from rich-to-word;

const richText = `<p>hello rich-to-word</p><p><img src="https://avatars.githubusercontent.com/u/8125081?v=4" alt="" data-href="" style=""/></p>`

const blob = await richToWord(html);
const link = document.createElement('a');
const blobUrl = window.URL.createObjectURL(blob);
link.href = blobUrl;
link.download = 'word.docx';
link.click();

```

or

```js
import { richToWordSave } from 'rich-to-word';
// use file-saver to download

const richText = `<p>hello rich-to-word</p><p><img src="https://avatars.githubusercontent.com/u/8125081?v=4" alt="" data-href="" style=""/></p>`;

richToWordSave(richText, 'word');
// await richToWordSave(richText, 'word');
```

## Options

richToWord(richText, **options**)

richToWordSave(richText, fileName, **options**)

* [imgDefaultStyle] (string): set img default style
* [disablePreprocess] (boolean): if need to handle it yourself, disable the default style

## Use in Vite

see [rich-to-word-vite](https://github.com/iclae/rich-to-word-vite)

## LICENSE

MIT

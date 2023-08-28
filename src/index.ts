// @ts-ignore
import imageToBase64 from 'image-to-base64/browser.min.js';
// @ts-ignore
import HTMLtoDOCX from 'html-to-docx/dist/html-to-docx.umd';
// @ts-ignore
import { saveAs } from 'file-saver';

const regex = /<img[^>]+src="([^">]+)"/gi;

const IMG_DEFAULT = 'width:100%;';

// see https://github.com/privateOmega/html-to-docx#parameters
type DocumentOptionType = {
  [key: string]: any;
};

type RichToWordOptionType = {
  imgDefaultStyle?: string;
  disablePreprocess?: boolean;
  documentOptions?: DocumentOptionType;
};

// 将富文本中的图片转换为base64编码
function convertImages(richText: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let result = richText;
    let match;
    while ((match = regex.exec(richText)) !== null) {
      // 获取图片src
      const src = match[1];
      // 如果src是http/https链接的图片
      if (src.startsWith('http')) {
        try {
          // 异步下载图片
          const base64 = await imageToBase64(src);
          // 将src替换为base64编码
          result = result.replace(src, `data:image/png;base64,${base64}`);
        } catch (error) {
          reject(error);
        }
      }
    }
    resolve(result);
  });
}

function preprocessor(
  richText: string,
  imgDefaultStyle: string = IMG_DEFAULT,
  disablePreprocess: boolean = false
) {
  let htmlDom = document.createElement('div');
  htmlDom.innerHTML = richText;

  // if img has no style, set default style, can fix img not show in word
  htmlDom.querySelectorAll('img').forEach(item => {
    let imgStyle = item.getAttribute('style');
    if (!imgStyle) {
      item.setAttribute(
        'style',
        imgDefaultStyle === '' ? IMG_DEFAULT : imgDefaultStyle
      );
    }
  });

  if (!disablePreprocess) {
    // code preprocess
    htmlDom.querySelectorAll('code').forEach(item => {
      let newItemWrapper = document.createElement('span');
      newItemWrapper.setAttribute('style', 'background-color: #f5f2f0;');
      let newItem = document.createElement('pre');
      newItem.innerHTML = item.innerHTML;
      newItemWrapper.appendChild(newItem);
      item.parentNode?.replaceChild(newItemWrapper, item);
    });

    // italic preprocess
    htmlDom.querySelectorAll('em').forEach(item => {
      let newItem = document.createElement('i');
      newItem.innerHTML = item.innerHTML;
      item.parentNode?.replaceChild(newItem, item);
    });
  }

  return htmlDom.innerHTML;
}

export default function richToWord(
  richText: string,
  options: RichToWordOptionType = {}
): Promise<Blob> {
  return new Promise(async resolve => {
    const {
      imgDefaultStyle,
      disablePreprocess,
      documentOptions = {},
    } = options;
    const result = await convertImages(
      preprocessor(richText, imgDefaultStyle, disablePreprocess)
    );
    const data = await HTMLtoDOCX(result, null, documentOptions);
    resolve(data);
  });
}
export async function richToWordSave(
  richText: string,
  docxName: string = 'word',
  options: RichToWordOptionType = {}
) {
  const blob = await richToWord(richText, options);
  saveAs(blob, `${docxName}.docx`);
}

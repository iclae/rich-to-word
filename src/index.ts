// @ts-ignore
import imageToBase64 from 'image-to-base64/browser.min.js';
// @ts-ignore
import HTMLtoDOCX from 'html-to-docx/dist/html-to-docx.umd';
// @ts-ignore
import { saveAs } from 'file-saver';

const regex = /<img[^>]+src="([^">]+)"/gi;

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

export default function richToWord(
  richText: string,
  options = {}
): Promise<Blob> {
  return new Promise(async resolve => {
    const result = await convertImages(richText);
    const data = await HTMLtoDOCX(result, null, options);
    resolve(data);
  });
}
export async function richToWordSave(
  richText: string,
  docxName: string = 'word',
  options = {}
) {
  const blob = await richToWord(richText, options);
  saveAs(blob, `${docxName}.docx`);
}
